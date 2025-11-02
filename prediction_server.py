 #-*- coding: utf-8 -*-


import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["https://cementaiextend.web.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


# Load trained model at startup
# MODEL_PATH = 'notebooks/best_nonlinear_model.pkl'


MODEL_PATH = os.path.join(os.path.dirname(__file__), 'notebooks', 'best_nonlinear_model.pkl')

model = None
scaler = None
def load_model():
    global model, scaler
    try:
        # Load model
        if not os.path.exists('notebooks/best_nonlinear_model.pkl'):
            logger.error(f'❌ Model file not found: notebooks/best_nonlinear_model.pkl')
            return False
        
        model = joblib.load('notebooks/best_nonlinear_model.pkl')
        logger.info(f'✅ Model loaded from notebooks/best_nonlinear_model.pkl')
        
        # Load scaler
        if not os.path.exists('notebooks/feature_scaler.pkl'):
            logger.error(f'❌ Scaler file not found: notebooks/feature_scaler.pkl')
            return False
        
        scaler = joblib.load('notebooks/feature_scaler.pkl')
        logger.info(f'✅ Scaler loaded from notebooks/feature_scaler.pkl')
        
        return True
    except Exception as e:
        logger.error(f'❌ Failed to load model/scaler: {e}')
        return False

# Health check endpoint (required by Cloud Run)
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    }), 200

# Status endpoint
@app.route('/', methods=['GET'])
def status():
    return jsonify({
        'service': 'cement-simulator-api',
        'status': 'running',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH,
        'timestamp': datetime.now().isoformat()
    }), 200

# Prediction endpoint (receives 15 features, returns prediction)
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            logger.error('❌ Model or scaler not loaded')
            return jsonify({'error': 'Model or scaler not loaded'}), 500
        
        # Get JSON data from frontend
        data = request.get_json()
        logger.info(f'📨 [RECEIVED] Raw JSON from frontend: {data}')
        
        if not data:
            logger.error('❌ No input data provided')
            return jsonify({'error': 'No input data provided'}), 400
        
        # Extract 15 features - THESE MUST MATCH YOUR PARAMETER NAMES
        feature_keys = [
            'FeedSize', 'ProductSize', 'MillPowerConsumption1', 'MillInletTemperature',
            'BlendingEfficiency', 'C5Temperature', 'HeatRecoveryEfficiency',
            'FuelFlowRate', 'PrimaryFuelFlow', 'SecondaryAirTemp',
            'KilnDrivePower', 'ClinkerInletTemp', 'CoolingAirFlow',
            'MillPowerConsumption2', 'PackingRate'
        ]
        
        try:
            # Extract raw values from frontend
            raw_features = np.array([
                float(data.get(key, 0)) for key in feature_keys
            ]).reshape(1, -1)
            
            logger.info(f'✅ [RAW FEATURES] Extracted from frontend:')
            for i, (key, val) in enumerate(zip(feature_keys, raw_features[0])):
                logger.info(f'   Feature {i+1} ({key}): {val}')
            
            # **CRITICAL: SCALE THE FEATURES BEFORE PREDICTION**
            features_scaled = scaler.transform(raw_features)
            
            logger.info(f'✅ [SCALED FEATURES] After StandardScaler:')
            for i, (key, val) in enumerate(zip(feature_keys, features_scaled[0])):
                logger.info(f'   Feature {i+1} ({key}): {val:.4f}')
            
        except ValueError as e:
            logger.error(f'❌ Invalid feature values: {str(e)}')
            return jsonify({'error': f'Invalid feature values: {str(e)}'}), 400
        
        # Make prediction using SCALED features
        logger.info(f'🔮 Making prediction with scaled features')
        prediction = model.predict(features_scaled)[0]
        logger.info(f'✅ [PREDICTION] Raw output: {prediction}')
        
        # **IMPORTANT: Ensure prediction is between 0-100 for efficiency percentage**
        prediction_clamped = np.clip(prediction, 0, 100)
        logger.info(f'✅ [PREDICTION] Final (clamped): {prediction_clamped}')
        
        # Return prediction with metadata
        response = {
            'prediction': float(prediction_clamped),
            'features_received': 15,
            'timestamp': datetime.now().isoformat(),
            'model_type': type(model).__name__,
            'scaler_used': True
        }
        
        logger.info(f'📤 [RESPONSE] Sending back: {response}')
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f'❌ Prediction error: {str(e)}')
        logger.error(f'   Error type: {type(e).__name__}')
        import traceback
        logger.error(f'   Traceback: {traceback.format_exc()}')
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load model before starting server
    if not load_model():
        logger.error('⚠️  Starting server without model')
    
    # Get port from environment or default to 5000
    PORT = int(os.getenv('PORT', 5000))
    
    # Start Flask server
    app.run(host='0.0.0.0', port=PORT, debug=False)
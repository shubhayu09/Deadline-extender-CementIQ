# -*- coding: utf-8 -*-
import os
import json
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/', methods=['GET'])
def status():
    return jsonify({'service': 'cement-optimizer-api', 'status': 'running'}), 200

@app.route('/get-optimal-solution', methods=['GET'])
def get_optimal_solution():
    """
    Read top_nonlinear_solutions.json and return rank 1 solution
    JSON format: 
    {
      "top_solutions": [
        {"rank": 1, "efficiency": 95.5, "F1": 900, ...},
        {"rank": 2, "efficiency": 94.2, "F1": 850, ...},
        {"rank": 3, "efficiency": 93.8, "F1": 920, ...}
      ]
    }
    """
    try:
        # Try multiple possible paths
        possible_paths = [
            'notebooks/top_nonlinear_solutions.json',
            './notebooks/top_nonlinear_solutions.json',
            '../notebooks/top_nonlinear_solutions.json',
            'top_nonlinear_solutions.json',
            '/app/notebooks/top_nonlinear_solutions.json'
        ]
        
        json_path = None
        for path in possible_paths:
            if os.path.exists(path):
                json_path = path
                logger.info(f'✅ Found JSON file at: {path}')
                break
        
        if not json_path:
            error_msg = f'❌ JSON file not found. Current dir: {os.getcwd()}'
            logger.error(error_msg)
            if os.path.exists('notebooks'):
                logger.error(f'📁 Contents of notebooks/: {os.listdir("notebooks")}')
            return jsonify({'error': error_msg}), 404
        
        # Read JSON file
        logger.info(f'📖 Reading JSON file: {json_path}')
        with open(json_path, 'r') as f:
            data = json.load(f)
        
        logger.info(f'✅ JSON loaded successfully')
        logger.info(f'🔑 Keys in JSON: {list(data.keys())}')
        
        # JSON should be a dictionary with "top_solutions" key
        if not isinstance(data, dict):
            error_msg = f'❌ Expected dict but got {type(data).__name__}'
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
        
        if 'top_solutions' not in data:
            error_msg = f'❌ "top_solutions" key not found. Available keys: {list(data.keys())}'
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
        
        top_solutions = data['top_solutions']
        logger.info(f'✅ Found top_solutions')
        logger.info(f'📊 Total solutions: {len(top_solutions)}')
        
        if not isinstance(top_solutions, list) or len(top_solutions) == 0:
            error_msg = f'❌ top_solutions should be non-empty list'
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
        
        # Find the solution with rank = 1
        rank_1_solution = None
        for solution in top_solutions:
            if solution.get('rank') == 1:
                rank_1_solution = solution
                break
        
        if rank_1_solution is None:
            error_msg = f'❌ No solution with rank=1 found'
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
        
        logger.info(f'✅ Extracted rank 1 solution')
        logger.info(f'🔑 Keys in solution: {list(rank_1_solution.keys())}')
        logger.info(f'📊 Efficiency: {rank_1_solution.get("efficiency", "N/A")}')
        logger.info(f'🎯 Rank: {rank_1_solution.get("rank", "N/A")}')
        
        response = {
            'success': True,
            'rank': 1,
            'solution': rank_1_solution,
            'total_solutions': len(top_solutions),
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f'📤 Sending optimal solution')
        return jsonify(response), 200
    
    except json.JSONDecodeError as e:
        error_msg = f'❌ JSON parse error: {str(e)}'
        logger.error(error_msg)
        return jsonify({'error': error_msg}), 400
    
    except Exception as e:
        error_msg = f'❌ Error: {str(e)}'
        logger.error(error_msg)
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({'error': error_msg, 'type': type(e).__name__}), 500

if __name__ == '__main__':
    logger.info(f'🚀 Starting Optimizer API on port 5001')
    logger.info(f'📍 Working directory: {os.getcwd()}')
    PORT = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=PORT, debug=False)

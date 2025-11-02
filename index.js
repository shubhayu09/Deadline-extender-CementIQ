// functions/index.js
// ✅ FULLY CORRECTED VERSION - ALL SYNTAX ERRORS FIXED

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const twilio = require('twilio');
const alertConfig = require('./alert-config');
//const message1 ='Alert! Clinker inlet temperature is {value}°C, outside safe range {min}–{max}°C. Check kiln conditions immediately.'
// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://cementaiextend-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

const db = admin.database();
const TWILIO_ACCOUNT_SID = "xxxxxxxxxxxxxxxxxx";
const TWILIO_AUTH_TOKEN = "xxxxxxxxxxxxxxxx";
const TWILIO_PHONE_NUMBER = "xxxxxx"
// Initialize Twilio client
const twilioClient = twilio(
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
);
// const twilioClient = twilio(
//     alertConfig.twilio.accountSid,
//     alertConfig.twilio.authToken
// );

// Store last alert times to prevent spam
const lastAlertTimes = {};

/**
 * Check if alert cooldown period has passed
 */
function canSendAlert(parameterName) {
    const now = Date.now();
    const lastAlertTime = lastAlertTimes[parameterName] || 0;
    const cooldownMs = alertConfig.cooldownMinutes * 60 * 1000;
    return (now - lastAlertTime) > cooldownMs;
}

/**
 * Update last alert time
 */
function updateLastAlertTime(parameterName) {
    lastAlertTimes[parameterName] = Date.now();
}

/**
 * Make phone call using Twilio
 */
async function makePhoneCall(phoneNumber, message) {
    try {
        // Create proper TwiML for voice call
        const twiml = `<Response>
      <Say voice="alice" language="en-IN">
        ${message}
      </Say>
      <Pause length="2"/>
      <Say voice="alice" language="en-IN">
        I repeat. ${message}
      </Say>
    </Response>`;

        const call = await twilioClient.calls.create({
            twiml: twiml,
            to: phoneNumber,
            from: '+19036367815',
            timeout: 30
        });

        console.log(`✅ Call initiated to ${phoneNumber}. SID: ${call.sid}`);
        return call;
    } catch (error) {
        console.error(`❌ Failed to call ${phoneNumber}:`, error);
        throw error;
    }
}

/**
 * Send SMS as backup (optional)
 */
async function sendSMS(phoneNumber, message) {
    try {
        const sms = await twilioClient.messages.create({
            body: message,
            to: phoneNumber,
            from: alertConfig.twilio.phoneNumber
        });

        console.log(`✅ SMS sent to ${phoneNumber}. SID: ${sms.sid}`);
        return sms;
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${phoneNumber}:`, error);
        throw error;
    }
}

/**
 * Check if value is outside threshold
 */
function isOutsideThreshold(parameter, value) {
    const threshold = alertConfig.thresholds[parameter];

    if (!threshold || !threshold.enabled) {
        return false;
    }

    return value < threshold.min || value > threshold.max;
}

/**
 * Generate alert message
 */
function generateMessage(parameter, value) {
    const threshold = alertConfig.thresholds[parameter];
    const template = alertConfig.messages[parameter] ||
        `Alert! ${parameter} is ${value}, which is outside safe range.`;

    return template
        .replace('{value}', value)
        .replace('{min}', threshold.min)
        .replace('{max}', threshold.max);
}

/**
 * Firebase Function: Monitor data changes and trigger alerts
 * Watches the step5_cooling_grinding data for threshold violations
 */
exports.monitorCementPlantData = functions.database
    .ref('/live_data/step5_cooling_grinding/current')
    .onUpdate(async (change, context) => {
        const newData = change.after.val();

        if (!newData) {
            console.log('❌ No data received');
            return null;
        }

        console.log('📊 Data update detected at:', new Date().toISOString());
        const alerts = [];

        // Check each parameter
        for (const [parameter, value] of Object.entries(newData)) {
            //Skip non-numeric parameters and timestamp
            // if (typeof value !== 'number' || parameter === 'timestamp' || parameter === 'Time') {
            //     continue;
            // }

            // Check if threshold is violated
            if (isOutsideThreshold(parameter, value)) {
                // Check cooldown period
                if (!canSendAlert(parameter)) {
                    console.log(`⏳ Alert cooldown active for ${parameter}`);
                    continue;
                }

                console.log(`🚨 ALERT TRIGGERED: ${parameter} = ${value}`);

                // Generate message
                const message = generateMessage(parameter, value);

                // Store alert info
                alerts.push({
                    parameter,
                    value,
                    message,
                    timestamp: new Date().toISOString()
                });

                // Update cooldown
                updateLastAlertTime(parameter);

                // Make calls to all configured numbers
                const callPromises = alertConfig.phoneNumbers.map(phoneNumber =>
                    makePhoneCall(phoneNumber, message)
                        .catch(error => console.error(`Failed to call ${phoneNumber}:`, error))
                );

                // Also send SMS as backup
                const smsPromises = alertConfig.phoneNumbers.map(phoneNumber =>
                    sendSMS(phoneNumber, message)
                        .catch(error => console.error(`Failed to SMS ${phoneNumber}:`, error))
                );

                await Promise.allSettled([...callPromises, ...smsPromises]);
            }
        }

        // Log alerts to database
        if (alerts.length > 0) {
            try {
                await db.ref('alerts/triggered').push({
                    alerts: alerts,
                    timestamp: admin.database.ServerValue.TIMESTAMP
                });
                console.log(`✅ ${alerts.length} alert(s) logged to database`);
            } catch (error) {
                console.error('Error logging alerts:', error);
            }
        }

        return null;
    });

/**
 * HTTP Function: Test alert system
 * Endpoint: POST /testAlert
 */
exports.testAlert = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        const testMessage = 'This is a test alert from the Cement Plant monitoring system. If you receive this call, the alert system is working correctly.';

        const results = await Promise.allSettled(
            alertConfig.phoneNumbers.map(phoneNumber =>
                makePhoneCall(phoneNumber, testMessage)
            )
        );

        res.json({
            success: true,
            message: 'Test alerts sent',
            results: results.map((r, i) => ({
                phoneNumber: alertConfig.phoneNumbers[i],
                status: r.status,
                callSid: r.value?.sid,
                error: r.reason?.message
            }))
        });

    } catch (error) {
        console.error('Test alert failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * HTTP Function: Update alert configuration
 * Endpoint: POST /updateAlertConfig
 * Body: { parameter: string, min: number, max: number, enabled: boolean }
 */
exports.updateAlertConfig = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        const { parameter, min, max, enabled } = req.body;

        if (!parameter || !alertConfig.thresholds[parameter]) {
            return res.status(400).json({ error: 'Invalid parameter' });
        }

        // Update configuration in database
        await db.ref(`alert_config/thresholds/${parameter}`).set({
            min: min !== undefined ? min : alertConfig.thresholds[parameter].min,
            max: max !== undefined ? max : alertConfig.thresholds[parameter].max,
            enabled: enabled !== undefined ? enabled : alertConfig.thresholds[parameter].enabled
        });

        res.json({
            success: true,
            message: 'Alert configuration updated',
            parameter,
            config: {
                min,
                max,
                enabled
            }
        });

    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Scheduled Function: Daily alert system health check
 * Runs every day at 9 AM IST
 */
exports.dailyHealthCheck = functions.pubsub
    .schedule('every 24 hours')
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
        try {
            console.log('🏥 Running daily health check at:', new Date().toISOString());

            // Check if alerts are functioning
            const recentAlerts = await db.ref('alerts/triggered')
                .orderByChild('timestamp')
                .limitToLast(10)
                .once('value');

            console.log(`✅ Recent alerts count: ${recentAlerts.numChildren()}`);

            // Log health check
            await db.ref('health_checks').push({
                timestamp: admin.database.ServerValue.TIMESTAMP,
                status: 'ok',
                alertsCount: recentAlerts.numChildren()
            });

            return null;
        } catch (error) {
            console.error('Health check error:', error);
            return null;
        }
    });

/**
 * HTTP Function: Get recent alerts
 * Endpoint: GET /getAlerts?limit=20
 */
exports.getAlerts = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {
        const limit = parseInt(req.query.limit) || 20;

        const snapshot = await db.ref('alerts/triggered')
            .orderByChild('timestamp')
            .limitToLast(limit)
            .once('value');

        const alerts = [];

        snapshot.forEach(child => {
            alerts.push({
                id: child.key,
                ...child.val()
            });
        });

        res.json({
            success: true,
            count: alerts.length,
            alerts: alerts.reverse()
        });

    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

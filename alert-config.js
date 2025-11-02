// functions/alert-config.js
// ✅ CORRECTED CONFIGURATION FILE

module.exports = {
    // Alert thresholds - based on your Firebase schema (step5_cooling_grinding)
    thresholds: {
        Clinker_Inlet_Temperature_C: {
            min: 1250,
            max: 14000,
            enabled: true
        },
        Clinker_Outlet_Temperature_C: {
            min: 60,
            max: 80,
            enabled: true
        },
        Cooling_Air_Flow_Nm3min: {
            min: 400,
            max: 6000,
            enabled: true
        },
        Secondary_Air_Temperature_C: {
            min: 800,
            max: 10000,
            enabled: true
        },
        Grate_Speed_strokes_min: {
            min: 8,
            max: 180,
            enabled: true
        },
        Clinker_Production_Rate_tph: {
            min: 100,
            max: 1600,
            enabled: true
        },
        Cement_Mill_Power_kW: {
            min: 1800,
            max: 25000,
            enabled: true
        },
        Cement_Fineness_Blaine_m2kg: {
            min: 300,
            max: 4000,
            enabled: true
        },
        Cement_Fineness_45um_Percent_Retained: {
            min: 5,
            max: 150,
            enabled: true
        },
        Separator_Efficiency_Percent: {
            min: 75,
            max: 950,
            enabled: true
        },
        Gypsum_Addition_Percent: {
            min: 3,
            max: 50,
            enabled: true
        },
        Clinker_Feed_Rate_tph: {
            min: 100,
            max: 1500,
            enabled: true
        },
        Under_Grate_Pressure_mbar: {
            min: 10,
            max: 300,
            enabled: true
        }
    },

    // Alert recipients - REPLACE with your actual phone numbers
    phoneNumbers: [
        '+91XXXXXX' // Replace with your actual phone number
    ],

    // Twilio configuration - Set these via Firebase functions:config:set
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },

    // Cooldown between repeated alerts (in minutes)
    cooldownMinutes: 10,

    // Alert message templates
    messages: {
        Clinker_Inlet_Temperature_C: 'Alert! Clinker inlet temperature is {value}°C, outside safe range {min}–{max}°C. Check kiln conditions immediately.',
        Clinker_Outlet_Temperature_C: 'Alert! Clinker outlet temperature is {value}°C, outside safe range {min}–{max}°C. Check cooling system.',
        Cooling_Air_Flow_Nm3min: 'Alert! Cooling air flow is {value} cubic meters per minute, outside safe range {min}–{max}. Verify cooling system.',
        Secondary_Air_Temperature_C: 'Alert! Secondary air temperature is {value}°C, outside safe range {min}–{max}°C. Check preheater.',
        Grate_Speed_strokes_min: 'Alert! Grate speed is {value} strokes per minute, outside safe range {min}–{max}. Inspect grate mechanism.',
        Clinker_Production_Rate_tph: 'Alert! Clinker production rate is {value} tons per hour, outside target range {min}–{max}. Adjust feed rate.',
        Cement_Mill_Power_kW: 'Alert! Cement mill power is {value} kilowatts, outside normal range {min}–{max}. Check for grinding issues.',
        Cement_Fineness_Blaine_m2kg: 'Alert! Cement fineness is {value} m²/kg, outside target range {min}–{max}. Adjust mill operation.',
        Cement_Fineness_45um_Percent_Retained: 'Alert! Cement 45 micron residue is {value} percent, outside range {min}–{max}. Check separator.',
        Separator_Efficiency_Percent: 'Alert! Separator efficiency is {value} percent, below target range {min}–{max}. Clean separator.',
        Gypsum_Addition_Percent: 'Alert! Gypsum addition is {value} percent, outside range {min}–{max}. Verify dosing.',
        Clinker_Feed_Rate_tph: 'Alert! Clinker feed rate is {value} tons per hour, outside range {min}–{max}. Adjust feed.',
        Under_Grate_Pressure_mbar: 'Alert! Under grate pressure is {value} mbar, outside range {min}–{max}. Check grate conditions.'
    }
};


from flask import Flask, jsonify
import json
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the Keras model
model = tf.keras.models.load_model('environment_classifier_model.keras')

# Prepare the scaler (use the same scaling parameters used during training)
scaler = StandardScaler()
scaler.mean_ = np.array([1.17, 2.0, 0.05, 31.0])  # Example means
scaler.scale_ = np.array([0.02, 1.0, 0.1, 2.0])   # Example scales

# API route to get random predictions and send them to the frontend
@app.route('/predict-data', methods=['GET'])
def predict_data():
    # Load the JSON data from file
    with open('data.json', 'r') as f:
        data = json.load(f)

    # Select a random record from the data
    random_record = random.choice(data)

    # Prepare the feature data and preprocess it
    feature = np.array([[random_record['co'], random_record['humidity'], random_record['temp'], random_record['noise']]])
    scaled_feature = scaler.transform(feature)

    # Get prediction from the model
    prediction = model.predict(scaled_feature)

    # Determine the status based on the prediction
    status = 'Ideal Environment (Good)' if prediction[0][0] > 0.5 else 'Non-Ideal Environment'

    # Prepare the result with both input data and prediction
    result = {
        "co": random_record['co'],
        "humidity": random_record['humidity'],
        "temp": random_record['temp'],
        "noise": random_record['noise'],
        "prediction": status
    }

    # Send the result back as a JSON response
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

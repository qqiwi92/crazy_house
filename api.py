import pickle
from flask import Flask, jsonify, request
from flask_cors import CORS

DB_FILE = "clinic_db.pkl"

app = Flask(__name__)
CORS(app, allow_headers="Content-Type")

def load_data():
    try:
        with open(DB_FILE, "rb") as file:
            return pickle.load(file)
    except FileNotFoundError:
        return []

def save_data(data):
    with open(DB_FILE, "wb") as file:
        pickle.dump(data, file)

@app.route("/db", methods=["GET"])
def get_db_data():
    """Endpoint to get the database data as JSON."""
    data = load_data()
    return jsonify(data)

@app.route("/db", methods=["POST"])
def set_db_data():
    """Endpoint to set the database data using JSON."""
    request_data = request.json
    if not isinstance(request_data, list):
        return jsonify({"error": "Invalid data format. Expected a list."}), 400

    save_data(request_data)
    return jsonify({"message": "Database updated successfully."})

if __name__ == "__main__":
    app.run(debug=True)

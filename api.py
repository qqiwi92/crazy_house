import pickle
from flask import Flask, jsonify, request
from flask_cors import CORS
from main import *

DB_FILE = "clinic_db.pkl"

app = Flask(__name__)
CORS(app, allow_headers='Content-Type')


def load_data():
    try:
        with open(DB_FILE, "rb") as file:
            return pickle.load(file)
    except FileNotFoundError:
        return []


def save_data(data):
    with open(DB_FILE, "wb") as file:
        pickle.dump(data, file)


def add_doctor(data, surname, name, room, specialty, patients):
    if len(patients) > 10:
        return {"error": "У врача не может быть более 10 пациентов."}
    data.append(
        {
            "surname": surname,
            "name": name,
            "room": room,
            "specialty": specialty,
            "patients": patients,
        }
    )
    save_data(data)
    return {"message": "Врач добавлен успешно"}


def delete_doctor(data, surname, name):
    updated_data = [
        doc for doc in data if not (doc["surname"] == surname and doc["name"] == name)
    ]
    save_data(updated_data)
    return {"message": "Врач удален успешно"}


def edit_doctor(data, surname, name, updated_info):
    for doctor in data:
        if doctor["surname"] == surname and doctor["name"] == name:
            doctor.update(updated_info)
            save_data(data)
            return {"message": "Данные врача обновлены"}
    return {"error": "Врач не найден"}


@app.route("/doctors/specialty/<specialty>", methods=["GET"])
def get_doctors_by_specialty(specialty):
    return jsonify(list_doctors_by_specialty(load_data(), specialty))


@app.route("/doctors/patient/<patient_surname>", methods=["GET"])
def get_doctors_by_patient(patient_surname):
    return jsonify(list_doctors_by_patient(load_data(), patient_surname))


@app.route("/doctors/room/<int:room>", methods=["GET"])
def get_doctors_by_room(room):
    return jsonify(list_doctors_by_room(load_data(), room))


@app.route("/rooms/specialty/<specialty>", methods=["GET"])
def get_rooms_by_specialty(specialty):
    return jsonify(list_rooms_by_specialty(load_data(), specialty))


@app.route("/doctors/many-patients", methods=["GET"])
def get_doctors_by_patient_count():
    return jsonify(list_doctors_by_patient_count(load_data()))


@app.route("/specialties/top", methods=["GET"])
def get_top_specialties():
    return jsonify(top_specialties_by_patients(load_data()))


@app.route("/doctors/least-clients", methods=["GET"])
def get_doctors_with_least_clients():
    return jsonify(doctors_with_least_clients(load_data()))


@app.route("/doctors", methods=["GET"])
def get_all_doctors():
    return jsonify(load_data())

@app.route("/doctors/add", methods=["POST"])
def add_new_doctor():
    data = load_data()
    request_data = request.json
    response = add_doctor(
        data,
        request_data["surname"],
        request_data["name"],
        request_data["room"],
        request_data["specialty"],
        request_data["patients"],
    )
    return jsonify(response)


@app.route("/doctors/delete", methods=["DELETE"])
def remove_doctor():
    data = load_data()
    request_data = request.json
    response = delete_doctor(data, request_data["surname"], request_data["name"])
    return jsonify(response)


@app.route("/doctors/edit", methods=["PUT"])
def update_doctor():
    data = load_data()
    request_data = request.json
    response = edit_doctor(
        data,
        request_data["surname"],
        request_data["name"],
        request_data["updated_info"],
    )
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)

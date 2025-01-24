
import pickle
from collections import Counter

DB_FILE = "clinic_db.pkl"

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
        print("У врача не может быть более 10 пациентов.")
        return
    data.append({
        "surname": surname,
        "name": name,
        "room": room,
        "specialty": specialty,
        "patients": patients
    })
    save_data(data)

def delete_doctor(data, surname, name):
    updated_data = [doc for doc in data if not (doc["surname"] == surname and doc["name"] == name)]
    save_data(updated_data)

def edit_doctor(data, surname, name, updated_info):
    for doctor in data:
        if doctor["surname"] == surname and doctor["name"] == name:
            doctor.update(updated_info)
            break
    save_data(data)

def list_doctors_by_specialty(data, specialty):
    return [doc for doc in data if doc["specialty"] == specialty]

def list_doctors_by_patient(data, patient_surname):
    return [doc for doc in data if any(patient["surname"] == patient_surname for patient in doc["patients"])]

def list_doctors_by_room(data, room):
    return sorted([doc for doc in data if doc["room"] == room], key=lambda x: x["surname"])

def list_rooms_by_specialty(data, specialty):
    return list(set(doc["room"] for doc in data if doc["specialty"] == specialty))

def list_doctors_by_patient_count(data):
    return sorted([doc for doc in data if len(doc["patients"]) > 5], key=lambda x: len(x["patients"]), reverse=True)

def top_specialties_by_patients(data):
    specialty_counter = Counter()
    for doc in data:
        specialty_counter[doc["specialty"]] += len(doc["patients"])
    return specialty_counter.most_common(3)

def doctors_with_least_clients(data):
    specialties = set(doc["specialty"] for doc in data)
    result = []
    for specialty in specialties:
        filtered_docs = [doc for doc in data if doc["specialty"] == specialty]
        filtered_docs.sort(key=lambda x: len(x["patients"]))
        result.extend(filtered_docs)
    return sorted(result, key=lambda x: len(x["patients"]))

if __name__ == "__main__":
    data = load_data()
    if not data:
        for i in range(1, 31):
            add_doctor(data, f"Фамилия{i}", f"Имя{i}", i % 10 + 1, f"Специальность{i % 5 + 1}",
                       [{"surname": f"Пациент{j}", "diagnosis": f"Диагноз{j}"} for j in range(i % 10)])

    print("Врачи специальности 'Специальность1':", list_doctors_by_specialty(data, "Специальность1"))
    print("Врачи, у которых лечился Пациент3:", list_doctors_by_patient(data, "Пациент3"))
    print("Врачи кабинета 2:", list_doctors_by_room(data, 2))
    print("Кабинеты для специальности 'Специальность2':", list_rooms_by_specialty(data, "Специальность2"))
    print("Врачи с более чем 5 пациентами:", list_doctors_by_patient_count(data))
    print("Топ-3 специальностей по пациентам:", top_specialties_by_patients(data))
    print("Врачи с наименьшим числом пациентов в каждой области:", doctors_with_least_clients(data))
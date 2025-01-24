import pickle
from flask import Flask, request, jsonify

class Doctor:
    def __init__(self, last_name, first_name, office, specialty, patients=None):
        self.last_name = last_name
        self.first_name = first_name
        self.office = office
        self.specialty = specialty
        self.patients = patients if patients else []

    def __repr__(self):
        return f"{self.first_name} {self.last_name}, {self.specialty}, Office: {self.office}"

class ClinicDatabase:
    def __init__(self, filename):
        self.filename = filename
        try:
            with open(filename, 'rb') as file:
                self.doctors = pickle.load(file)
        except FileNotFoundError:
            self.doctors = []

    def save(self):
        with open(self.filename, 'wb') as file:
            pickle.dump(self.doctors, file)

    def add_doctor(self, doctor):
        self.doctors.append(doctor)
        self.save()

    def remove_doctor(self, last_name, first_name):
        self.doctors = [d for d in self.doctors if d.last_name != last_name or d.first_name != first_name]
        self.save()

    def edit_doctor(self, last_name, first_name, **kwargs):
        for doctor in self.doctors:
            if doctor.last_name == last_name and doctor.first_name == first_name:
                for key, value in kwargs.items():
                    setattr(doctor, key, value)
                self.save()
                break

    def get_doctors_by_specialty(self, specialty):
        return [d for d in self.doctors if d.specialty == specialty]

    def get_doctors_by_patient(self, patient_last_name):
        return [d for d in self.doctors if any(p[0] == patient_last_name for p in d.patients)]

    def get_doctors_by_office(self, office):
        return sorted([d for d in self.doctors if d.office == office], key=lambda x: x.last_name)

    def get_offices_by_specialty(self, specialty):
        return list(set(d.office for d in self.doctors if d.specialty == specialty))

    def get_top_doctors_by_patient_count(self, threshold):
        return sorted(
            [d for d in self.doctors if len(d.patients) > threshold],
            key=lambda x: (-len(x.patients), x.specialty)
        )

    def get_top_specialties(self, top_n):
        specialty_counts = {}
        for doctor in self.doctors:
            specialty_counts[doctor.specialty] = specialty_counts.get(doctor.specialty, 0) + len(doctor.patients)
        return sorted(specialty_counts.items(), key=lambda x: -x[1])[:top_n]

    def get_least_busy_doctors(self):
        specialties = {}
        for doctor in self.doctors:
            if doctor.specialty not in specialties:
                specialties[doctor.specialty] = []
            specialties[doctor.specialty].append(doctor)

        result = []
        for doctors in specialties.values():
            result.extend(sorted(doctors, key=lambda d: len(d.patients)))
        return result

# Flask setup
app = Flask(__name__)
db = ClinicDatabase('doctors.pkl')

@app.route('/add', methods=['POST'])
def add_doctor():
    data = request.json
    doctor = Doctor(data['last_name'], data['first_name'], data['office'], data['specialty'], data.get('patients', []))
    db.add_doctor(doctor)
    return jsonify({'message': 'Doctor added successfully'})

@app.route('/remove', methods=['DELETE'])
def remove_doctor():
    data = request.json
    db.remove_doctor(data['last_name'], data['first_name'])
    return jsonify({'message': 'Doctor removed successfully'})

@app.route('/edit', methods=['PUT'])
def edit_doctor():
    data = request.json
    db.edit_doctor(data['last_name'], data['first_name'], **data.get('updates', {}))
    return jsonify({'message': 'Doctor updated successfully'})

@app.route('/specialty/<specialty>', methods=['GET'])
def get_by_specialty(specialty):
    return jsonify([str(d) for d in db.get_doctors_by_specialty(specialty)])

@app.route('/patient/<last_name>', methods=['GET'])
def get_by_patient(last_name):
    return jsonify([str(d) for d in db.get_doctors_by_patient(last_name)])

@app.route('/office/<int:office>', methods=['GET'])
def get_by_office(office):
    return jsonify([str(d) for d in db.get_doctors_by_office(office)])

@app.route('/offices/<specialty>', methods=['GET'])
def get_offices(specialty):
    return jsonify(db.get_offices_by_specialty(specialty))

@app.route('/top-specialties', methods=['GET'])
def top_specialties():
    return jsonify(db.get_top_specialties(3))

@app.route('/top-doctors', methods=['GET'])
def top_doctors():
    return jsonify([str(d) for d in db.get_top_doctors_by_patient_count(5)])

@app.route('/least-busy', methods=['GET'])
def least_busy():
    return jsonify([str(d) for d in db.get_least_busy_doctors()])

if __name__ == '__main__':
    app.run(debug=True)

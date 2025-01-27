const fs = require('fs');

const firstNames = ['Александр', 'Сергей', 'Дмитрий', 'Андрей', 'Алексей', 'Максим', 'Евгений', 'Иван', 'Михаил', 'Даниил', 'Артем', 'Николай', 'Владимир', 'Павел', 'Егор', 'Илья', 'Роман', 'Виктор', 'Тимофей'];
const lastNames = ['Смирнов', 'Иванов', 'Кузнецов', 'Соколов', 'Попов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Петров', 'Волков', 'Соловьев', 'Васильев', 'Зайцев', 'Павлов', 'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев'];
const patientNames = ['Антонов', 'Тарасов', 'Белов', 'Комаров', 'Орлов', 'Киселев', 'Макаров', 'Андреев', 'Ковалев', 'Ильин', 'Гусев', 'Титов', 'Кузьмин', 'Кудрявцев', 'Баранов', 'Куликов', 'Алексеев', 'Степанов', 'Яковлев', 'Сорокин'];

const specialties = ['Терапевт', 'Хирург', 'Педиатр', 'Офтальмолог', 'Невролог', 'Кардиолог', 'Эндокринолог', 'Гастроэнтеролог', 'Дерматолог', 'Ортопед', 'Уролог', 'Гинеколог', 'Отоларинголог', 'Психиатр', 'Онколог'];

const diagnoses = ['Грипп', 'Гипертония', 'Гастрит', 'Бронхит', 'Артрит', 'Мигрень', 'Диабет', 'Астма', 'Аллергия', 'Пневмония', 'Ангина', 'Отит', 'Конъюнктивит', 'Дерматит', 'Остеохондроз'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePatients(count) {
  const patients = [];
  for (let i = 0; i < count; i++) {
    patients.push({
      surname: getRandomElement(patientNames),
      diagnosis: getRandomElement(diagnoses)
    });
  }
  return patients;
}

function generateDoctors(count) {
  const doctors = [];
  for (let i = 0; i < count; i++) {
    const patientCount = Math.floor(Math.random() * 10);
    doctors.push({
      name: getRandomElement(firstNames),
      surname: getRandomElement(lastNames),
      specialty: getRandomElement(specialties),
      room: Math.floor(Math.random() * 50) + 1,
      patients: generatePatients(patientCount)
    });
  }
  return doctors;
}

const doctorsData = generateDoctors(75);

console.log(JSON.stringify(doctorsData, null, 2));

fs.writeFileSync('medical_system_data.json', JSON.stringify(doctorsData, null, 2));
console.log('Data has been written to medical_system_data.json');
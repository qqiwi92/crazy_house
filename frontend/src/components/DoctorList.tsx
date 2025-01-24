import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface Doctor {
  surname: string;
  name: string;
  room: string;
  specialty: string;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    api
      .getDoctorsBySpecialty("All")
      .then((response) => {
        const fetchedDoctors: Doctor[] = response.data;
        setDoctors(fetchedDoctors);
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Doctor List</h2>
      {doctors.map((doctor, index) => (
        <Card key={index} className="mb-2">
          <CardContent className="p-4">
            <p>{doctor.surname}, {doctor.name}</p>
            <p>Specialty: {doctor.specialty}</p>
            <p>Room: {doctor.room}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorList;

import type React from "react";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/lib/types";

const Statistics: React.FC = () => {
  const [topSpecialties, setTopSpecialties] = useState<[string, number][]>([]);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [leastBusyDoctors, setLeastBusyDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // Fetch top specialties
    api
      .getTopSpecialties()
      .then((response) => setTopSpecialties(response.data))
      .catch((error) =>
        console.error("Error fetching top specialties:", error)
      );

    // Fetch top doctors with many patients
    api
      .getDoctorsByPatientCount()
      .then((response) => setTopDoctors(response.data))
      .catch((error) => console.error("Error fetching top doctors:", error));

    // Fetch least busy doctors
    api
      .getDoctorsWithLeastClients()
      .then((response) => setLeastBusyDoctors(response.data))
      .catch((error) =>
        console.error("Error fetching least busy doctors:", error)
      );
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 3 Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          {topSpecialties.map(([specialty, count], index) => (
            <div key={index} className="mb-2">
              {specialty}: {count} patients
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Doctors (more than patients)</CardTitle>
        </CardHeader>
        <CardContent>
          {topDoctors.map((doctor, index) => (
            <div key={index} className="mb-2">
              {doctor.name}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Least Busy Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          {leastBusyDoctors.map((doctor, index) => (
            <div key={index} className="mb-2">
              {doctor.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;

"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClinicManagement />
      <Toaster />
    </QueryClientProvider>
  );
}

interface Patient {
  last_name: string;
  diagnosis: string;
}

interface Doctor {
  surname: string;
  name: string;
  room: string;
  specialty: string;
  patients: Patient[];
}

function ClinicManagement() {
  const { toast } = useToast();
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    surname: "",
    name: "",
    room: "",
    specialty: "",
    patients: [],
  });
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchRoom, setSearchRoom] = useState("");

  const {
    data: doctors,
    isLoading,
    error,
    refetch,
  } = useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/doctors");
      if (!response.ok) {
        throw new Error("Ошибка сети");
      }
      return response.json();
    },
  });

  const addDoctorMutation = useMutation({
    mutationFn: (newDoctor: Doctor) =>
      fetch("http://localhost:5000/doctors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      }).then((res) => res.json()),
    onSuccess: () => {
      refetch();
      toast({ title: "Врач успешно добавлен" });
      setNewDoctor({
        surname: "",
        name: "",
        room: "",
        specialty: "",
        patients: [],
      });
    },
    onError: () => {
      toast({ title: "Ошибка при добавлении врача", variant: "destructive" });
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: (doctor: { surname: string; name: string }) =>
      fetch("http://localhost:5000/doctors/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      }).then((res) => res.json()),
    onSuccess: () => {
      refetch();
      toast({ title: "Врач успешно удален" });
    },
    onError: () => {
      toast({ title: "Ошибка при удалении врача", variant: "destructive" });
    },
  });

  const filterDoctorsBySpecialty = (specialty: string) => {
    return doctors?.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase())) || []
  }

  const filterDoctorsByPatient = (patientSurname: string) => {
    return (
      doctors?.filter((doctor) =>
        doctor.patients.some((patient) => patient.last_name.toLowerCase().includes(patientSurname.toLowerCase())),
      ) || []
    )
  }

  const filterDoctorsByRoom = (room: string) => {
    return doctors?.filter((doctor) => doctor.room.toString() === room) || []
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctorMutation.mutate(newDoctor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const addPatient = () => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: [...prev.patients, { last_name: "", diagnosis: "" }],
    }));
  };
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])

  const removePatient = (index: number) => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: prev.patients.filter((_, i) => i !== index),
    }));
  };

  const handlePatientChange = (
    index: number,
    field: keyof Patient,
    value: string
  ) => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: prev.patients.map((patient, i) =>
        i === index ? { ...patient, [field]: value } : patient
      ),
    }));
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Произошла ошибка: {error.message}</div>;

  return (
    <div className="  mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Система управления клиникой</h1>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Список врачей</h2>
          <Table>
            <div className="max-h-[400px] w-full">
              <TableHeader className="w-full">
                <TableRow className="w-full">
                  <TableHead className="w-full">Фамилия</TableHead>
                  <TableHead className="w-full">Имя</TableHead>
                  <TableHead className="w-full">Кабинет</TableHead>
                  <TableHead className="w-full">Специальность</TableHead>
                  <TableHead className="w-full">Пациенты</TableHead>
                  <TableHead className="w-full">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {doctors?.map((doctor: Doctor) => (
                  <TableRow key={`${doctor.surname}-${doctor.name}`}>
                    <TableCell className="w-full">{doctor.surname}</TableCell>
                    <TableCell className="w-full">{doctor.name}</TableCell>
                    <TableCell className="w-full">{doctor.room}</TableCell>
                    <TableCell className="w-full">{doctor.specialty}</TableCell>
                    <TableCell className="w-full">
                      {doctor.patients.length}
                    </TableCell>
                    <TableCell className="w-full">
                      <Button
                        variant="destructive"
                        onClick={() =>
                          deleteDoctorMutation.mutate({
                            surname: doctor.surname,
                            name: doctor.name,
                          })
                        }
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </div>
          </Table>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Добавить нового врача</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="surname"
              placeholder="Фамилия"
              value={newDoctor.surname}
              onChange={handleInputChange}
              required
            />
            <Input
              name="name"
              placeholder="Имя"
              value={newDoctor.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="room"
              placeholder="Кабинет"
              type="number"
              value={newDoctor.room}
              onChange={handleInputChange}
              required
            />
            <Input
              name="specialty"
              placeholder="Специальность"
              value={newDoctor.specialty}
              onChange={handleInputChange}
              required
            />
            <div>
              <Label className="mr-2">Пациенты</Label>
              {newDoctor.patients.map((patient, index) => (
                <Card key={index} className="mt-2">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Фамилия пациента"
                        value={patient.last_name}
                        onChange={(e) =>
                          handlePatientChange(
                            index,
                            "last_name",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Input
                        placeholder="Диагноз"
                        value={patient.diagnosis}
                        onChange={(e) =>
                          handlePatientChange(
                            index,
                            "diagnosis",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon" className="min-w-10"
                        onClick={() => removePatient(index)}
                      >
                        <Trash2 className=" w-10 text-xl" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPatient}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить пациента
              </Button>
            </div>
            <Button type="submit">Добавить врача</Button>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <div>
        <h3 className="text-xl font-semibold mb-2">Поиск врачей по специальности</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Введите специальность"
              value={searchSpecialty}
              onChange={(e) => setSearchSpecialty(e.target.value)}
            />
            <Button onClick={() => setFilteredDoctors(filterDoctorsBySpecialty(searchSpecialty))}>Поиск</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Фамилия</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Кабинет</TableHead>
                  <TableHead>Специальность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor: Doctor) => (
                  <TableRow key={`${doctor.surname}-${doctor.name}`}>
                    <TableCell>{doctor.surname}</TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.room}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Поиск врачей по пациенту</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Введите фамилию пациента"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
            <Button onClick={() => setFilteredDoctors(filterDoctorsByPatient(searchPatient))}>Поиск</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Фамилия</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Кабинет</TableHead>
                  <TableHead>Специальность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor: Doctor) => (
                  <TableRow key={`${doctor.surname}-${doctor.name}`}>
                    <TableCell>{doctor.surname}</TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.room}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Поиск врачей по кабинету</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Введите номер кабинета"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
            />
            <Button onClick={() => setFilteredDoctors(filterDoctorsByRoom(searchRoom))}>Поиск</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Фамилия</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Кабинет</TableHead>
                  <TableHead>Специальность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor: Doctor) => (
                  <TableRow key={`${doctor.surname}-${doctor.name}`}>
                    <TableCell>{doctor.surname}</TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.room}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}


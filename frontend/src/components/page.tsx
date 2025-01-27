"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit } from "lucide-react"
import { EditDoctorModal } from "./edlt-doctor-modal"
const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClinicManagement />
      <Toaster />
    </QueryClientProvider>
  )
}

interface Patient {
  last_name: string
  diagnosis: string
}

interface Doctor {
  surname: string
  name: string
  room: string
  specialty: string
  patients: Patient[]
}

function ClinicManagement() {
  const { toast } = useToast()
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    surname: "",
    name: "",
    room: "",
    specialty: "",
    patients: [],
  })
  const [searchSpecialty, setSearchSpecialty] = useState("")
  const [searchPatient, setSearchPatient] = useState("")
  const [searchRoom, setSearchRoom] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  const {
    data: doctors,
    isLoading,
    error,
    refetch,
  } = useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/db")
      if (!response.ok) {
        throw new Error("Network error")
      }
      return response.json()
    },
  })

  const updateDoctorsMutation = useMutation({
    mutationFn: (updatedDoctors: Doctor[]) =>
      fetch("http://localhost:5000/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoctors),
      }).then((res) => res.json()),
    onSuccess: () => {
      refetch()
      toast({ title: "Database updated successfully" })
    },
    onError: () => {
      toast({ title: "Error updating database", variant: "destructive" })
    },
  })

  const addDoctor = (newDoctor: Doctor) => {
    const updatedDoctors = [...(doctors || []), newDoctor]
    updateDoctorsMutation.mutate(updatedDoctors)
  }

  const deleteDoctor = (doctorToDelete: { surname: string; name: string }) => {
    const updatedDoctors = doctors?.filter(
      (doctor) => doctor.surname !== doctorToDelete.surname || doctor.name !== doctorToDelete.name,
    )
    if (updatedDoctors) {
      updateDoctorsMutation.mutate(updatedDoctors)
    }
  }

  const editDoctor = (updatedDoctor: Doctor) => {
    const updatedDoctors = doctors?.map((doctor) =>
      doctor.surname === updatedDoctor.surname && doctor.name === updatedDoctor.name ? updatedDoctor : doctor,
    )
    if (updatedDoctors) {
      updateDoctorsMutation.mutate(updatedDoctors)
    }
  }

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
    e.preventDefault()
    addDoctor(newDoctor)
    setNewDoctor({
      surname: "",
      name: "",
      room: "",
      specialty: "",
      patients: [],
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDoctor((prev) => ({ ...prev, [name]: value }))
  }

  const addPatient = () => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: [...prev.patients, { last_name: "", diagnosis: "" }],
    }))
  }

  const removePatient = (index: number) => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: prev.patients.filter((_, i) => i !== index),
    }))
  }

  const handlePatientChange = (index: number, field: keyof Patient, value: string) => {
    setNewDoctor((prev) => ({
      ...prev,
      patients: prev.patients.map((patient, i) => (i === index ? { ...patient, [field]: value } : patient)),
    }))
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Clinic Management System</h1>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">List of Doctors</h2>
          <Table>
            <div className="max-h-[400px] w-full">
              <TableHeader className="w-full">
                <TableRow className="w-full">
                  <TableHead className="w-full">Surname</TableHead>
                  <TableHead className="w-full">Name</TableHead>
                  <TableHead className="w-full">Room</TableHead>
                  <TableHead className="w-full">Specialty</TableHead>
                  <TableHead className="w-full">Patients</TableHead>
                  <TableHead className="w-full">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {doctors?.map((doctor: Doctor) => (
                  <TableRow key={`${doctor.surname}-${doctor.name}`}>
                    <TableCell className="w-full">{doctor.surname}</TableCell>
                    <TableCell className="w-full">{doctor.name}</TableCell>
                    <TableCell className="w-full">{doctor.room}</TableCell>
                    <TableCell className="w-full">{doctor.specialty}</TableCell>
                    <TableCell className="w-full">{doctor.patients.length}</TableCell>
                    <TableCell className="w-full">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingDoctor(doctor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteDoctor({
                              surname: doctor.surname,
                              name: doctor.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </div>
          </Table>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Doctor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="surname"
              placeholder="Surname"
              value={newDoctor.surname}
              onChange={handleInputChange}
              required
            />
            <Input name="name" placeholder="Name" value={newDoctor.name} onChange={handleInputChange} required />
            <Input
              name="room"
              placeholder="Room"
              type="number"
              value={newDoctor.room}
              onChange={handleInputChange}
              required
            />
            <Input
              name="specialty"
              placeholder="Specialty"
              value={newDoctor.specialty}
              onChange={handleInputChange}
              required
            />
            <div>
              <Label className="mr-2">Patients</Label>
              {newDoctor.patients.map((patient, index) => (
                <Card key={index} className="mt-2">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Patient's Surname"
                        value={patient.last_name}
                        onChange={(e) => handlePatientChange(index, "last_name", e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Diagnosis"
                        value={patient.diagnosis}
                        onChange={(e) => handlePatientChange(index, "diagnosis", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="min-w-10"
                        onClick={() => removePatient(index)}
                      >
                        <Trash2 className="w-10 text-xl" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addPatient} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </div>
            <Button type="submit">Add Doctor</Button>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Search Doctors by Specialty</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter specialty"
              value={searchSpecialty}
              onChange={(e) => setSearchSpecialty(e.target.value)}
            />
            <Button onClick={() => setFilteredDoctors(filterDoctorsBySpecialty(searchSpecialty))}>Search</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surname</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Specialty</TableHead>
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
          <h3 className="text-xl font-semibold mb-2">Search Doctors by Patient</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter patient's surname"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
            <Button onClick={() => setFilteredDoctors(filterDoctorsByPatient(searchPatient))}>Search</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surname</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Specialty</TableHead>
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
          <h3 className="text-xl font-semibold mb-2">Search Doctors by Room</h3>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Enter room number" value={searchRoom} onChange={(e) => setSearchRoom(e.target.value)} />
            <Button onClick={() => setFilteredDoctors(filterDoctorsByRoom(searchRoom))}>Search</Button>
          </div>
          {filteredDoctors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surname</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Specialty</TableHead>
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

      {editingDoctor && (
        <EditDoctorModal
          isOpen={!!editingDoctor}
          onClose={() => setEditingDoctor(null)}
          doctor={editingDoctor}
          onSave={editDoctor}
        />
      )}
    </div>
  )
}


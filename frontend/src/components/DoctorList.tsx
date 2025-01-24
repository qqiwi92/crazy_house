import type React from "react"
import { useState, useEffect } from "react"
import { api } from "../lib/api"
import { Card, CardContent } from "@/components/ui/card"

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<string[]>([])

  useEffect(() => {
    api
      .getDoctorsBySpecialty("All")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Doctor List</h2>
      {doctors.map((doctor, index) => (
        <Card key={index} className="mb-2">
          <CardContent className="p-4">{doctor}</CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DoctorList


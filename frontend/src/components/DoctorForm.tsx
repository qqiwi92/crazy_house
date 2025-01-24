import type React from "react";
import { useState } from "react";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const DoctorForm: React.FC = () => {
  const [doctor, setDoctor] = useState({
    last_name: "",
    first_name: "",
    office: "",
    specialty: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .addDoctor(doctor)
      .then(() => {
        toast({
          title: "Success",
          description: "Doctor added successfully",
        });
        setDoctor({ last_name: "", first_name: "", office: "", specialty: "" });
      })
      .catch((error) => {
        console.error("Error adding doctor:", error);
        toast({
          title: "Error",
          description: "Failed to add doctor",
          variant: "destructive",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={doctor.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={doctor.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="office">Office</Label>
            <Input
              id="office"
              name="office"
              value={doctor.office}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={doctor.specialty}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Add Doctor</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorForm;

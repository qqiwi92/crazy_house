import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DoctorList from "./components/DoctorList"
import DoctorForm from "./components/DoctorForm"
import SearchForm from "./components/SearchForm"
import Statistics from "./components/Statistics"

const App: React.FC = () => {
  return (
    <div className="container max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Clinic Management System</h1>
      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Doctor List</TabsTrigger>
          <TabsTrigger value="add">Add Doctor</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <DoctorList />
        </TabsContent>
        <TabsContent value="add">
          <DoctorForm />
        </TabsContent>
        <TabsContent value="search">
          <SearchForm />
        </TabsContent>
        <TabsContent value="stats">
          <Statistics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App


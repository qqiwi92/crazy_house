import type React from "react"

import Home from "./components/page"

const App: React.FC = () => {
  return (
    <div className="container max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Clinic Management System</h1>
     <Home/>
    </div>
  )
}

export default App


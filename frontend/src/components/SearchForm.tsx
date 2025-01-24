import type React from "react";
import { useState } from "react";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchForm: React.FC = () => {
  const [searchType, setSearchType] = useState<string>("specialty");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let searchFunction: any;
    switch (searchType) {
      case "specialty":
        searchFunction = api.getDoctorsBySpecialty;
        break;
      case "patient":
        searchFunction = api.getDoctorsByPatient;
        break;
      case "office":
        searchFunction = api.getDoctorsByOffice;
        break;
      default:
        return;
    }

    searchFunction(searchTerm)
      .then((response) => setResults(response.data))
      .catch((error) => console.error("Error searching:", error));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Doctors</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-type">Search Type</Label>
            <Select onValueChange={(value) => setSearchType(value)}>
              <SelectTrigger id="search-type">
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specialty">By Specialty</SelectItem>
                <SelectItem value="patient">By Patient</SelectItem>
                <SelectItem value="office">By Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search-term">Search Term</Label>
            <Input
              id="search-term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-4">
          {results.map((result, index) => (
            <Card key={index} className="mb-2">
              <CardContent className="p-4">{result}</CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;

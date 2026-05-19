"use client";

import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Download, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Patient } from "../../types/appwrite.types";
import AdminPatientsTable from "./AdminPatientsTable";

type FilterType = "all" | "male" | "female" | "other";

export default function Patients({ patients }: { patients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filter patients based on search term and gender filter
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Apply gender filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (patient) => patient.gender?.toLowerCase() === activeFilter,
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((patient) => {
        return (
          patient.name?.toLowerCase().includes(searchLower) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.phone?.toLowerCase().includes(searchLower) ||
          patient.address?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [patients, searchTerm, activeFilter]);

  // Export function
  const handleExport = (format: "csv" | "json") => {
    const dataToExport = filteredPatients.map((patient) => ({
      Name: patient.name || "N/A",
      Email: patient.email || "N/A",
      Phone: patient.phone || "N/A",
      Gender: patient.gender || "N/A",
      DateOfBirth: patient.birthDate
        ? new Date(patient.birthDate).toLocaleDateString()
        : "N/A",
      Address: patient.address || "N/A",
      EmergencyContact: patient.emergencyContactName || "N/A",
    }));

    if (format === "csv") {
      // Convert to CSV
      const headers = Object.keys(dataToExport[0]);
      const csvContent = [
        headers.join(","),
        ...dataToExport.map((row: any) =>
          headers.map((header) => `"${row[header]}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `patients_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export as JSON
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `patients_${new Date().toISOString().split("T")[0]}.json`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filterLabels: Record<FilterType, string> = {
    all: "All Patients",
    male: "Male",
    female: "Female",
    other: "Other",
  };

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="text-24-bold text-white"> Patients</h2>
          <p className="text-dark-600 text-14-regular mt-1">
            {filteredPatients.length} patient
            {filteredPatients.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto md:items-center lg:flex-row">
          {/* Search */}
          <div className="relative w-full">
            <Search className="text-dark-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-400 border-dark-500 w-full pl-10 text-white focus:ring-1 focus:ring-green-500 lg:w-80"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-dark-500 text-dark-600 hover:bg-dark-500 data-[state=open]:bg-dark-500"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {filterLabels[activeFilter]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-400 border-dark-500">
                {(Object.keys(filterLabels) as FilterType[]).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`hover:bg-dark-300 text-white ${
                      activeFilter === key
                        ? "bg-green-500/20 text-green-500"
                        : ""
                    }`}
                  >
                    {filterLabels[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-dark-500 text-dark-600 hover:bg-dark-500 data-[state=open]:bg-dark-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-400 border-dark-500">
                <DropdownMenuItem
                  onClick={() => handleExport("csv")}
                  className="hover:bg-dark-300 text-white"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("json")}
                  className="hover:bg-dark-300 text-white"
                >
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Data Table with filtered patients */}
      <AdminPatientsTable patients={filteredPatients} />
    </section>
  );
}

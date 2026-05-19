"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils/utils";
import { useState } from "react";
import { Patient } from "../../types/appwrite.types";
import PatientDetailsModal from "./PatientDetailsModal";

export default function AdminPatientsTable({
  patients,
}: {
  patients: Patient[];
}) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const columns: ColumnDef<Patient>[] = [
    {
      header: "#",
      cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <p className="text-14-medium">{row.original.name}</p>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <p className="text-14-regular">{row.original.email}</p>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <p className="text-14-regular">{row.original.phone}</p>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <p className="text-14-regular capitalize">{row.original.gender}</p>
      ),
    },
    {
      accessorKey: "birthDate",
      header: "Date of Birth",
      cell: ({ row }) => (
        <p className="text-14-regular">
          {formatDateTime(row.original.birthDate).dateOnly}
        </p>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPatient(row.original)}
          className="text-blue-500 transition-colors hover:text-blue-400"
        >
          View Details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="data-table">
        <Table className="shad-table">
          <TableHeader className="bg-dark-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="shad-table-row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="shad-gray-btn"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="shad-gray-btn"
          >
            Next
          </Button>
        </div>
      </div>
      <PatientDetailsModal
        patient={selectedPatient}
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </>
  );
}

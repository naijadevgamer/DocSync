"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Patient } from "../../../types/appwrite.types";
import AdminInsights from "./AdminInsights";
import Patients from "./Patients";
import RecentAppointments from "./RecentAppointments";

export default function AdminTabs({
  appointments,
  patients,
}: {
  appointments: any;
  patients: Patient[];
}) {
  const [tab, setTab] = useState("appointments");

  return (
    <Tabs className="w-full" value={tab} onValueChange={setTab}>
      <TabsList className="bg-dark-400 border-dark-500 mb-6 inline-flex rounded-xl border sm:gap-1 sm:p-1">
        <TabsTrigger
          value="appointments"
          className="text-12-medium hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-3"
        >
          Appointments
        </TabsTrigger>
        <TabsTrigger
          value="patients"
          className="text-12-medium hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-3"
        >
          Patients
        </TabsTrigger>
        <TabsTrigger
          value="insights"
          className="text-12-medium hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-3"
        >
          Insights
        </TabsTrigger>
      </TabsList>
      <TabsContent value="appointments">
        <RecentAppointments appointments={appointments} />
      </TabsContent>
      <TabsContent value="patients">
        <Patients patients={patients} />
      </TabsContent>
      <TabsContent value="insights">
        <AdminInsights appointments={appointments.documents} />
      </TabsContent>
    </Tabs>
  );
}

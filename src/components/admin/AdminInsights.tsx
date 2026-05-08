// app/admin/AdminInsights.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Beautiful color palette
const COLORS = {
  scheduled: "#24AE7C", // Green (primary)
  pending: "#FFD147", // Yellow/Gold
  cancelled: "#FF4F4E", // Red
  completed: "#79B5EC", // Blue
  noShow: "#BB6BD9", // Purple
  total: "#9CA3AF", // Gray
};

const CHART_COLORS = [
  COLORS.scheduled,
  COLORS.pending,
  COLORS.cancelled,
  COLORS.completed,
  COLORS.noShow,
];

export default function AdminInsights({
  appointments,
}: {
  appointments: any[];
}) {
  const [chartTab, setChartTab] = useState("trends");

  // Process data: appointments by month
  const monthlyData = appointments
    .reduce((acc: any[], appt) => {
      const month = new Date(appt.schedule).toLocaleString("default", {
        month: "short",
      });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.total += 1;
        if (appt.status === "scheduled") existing.scheduled += 1;
        if (appt.status === "pending") existing.pending += 1;
        if (appt.status === "cancelled") existing.cancelled += 1;
      } else {
        acc.push({
          month,
          total: 1,
          scheduled: appt.status === "scheduled" ? 1 : 0,
          pending: appt.status === "pending" ? 1 : 0,
          cancelled: appt.status === "cancelled" ? 1 : 0,
        });
      }
      return acc;
    }, [])
    .sort(
      (a, b) =>
        new Date(a.month + " 1, 2024").getMonth() -
        new Date(b.month + " 1, 2024").getMonth(),
    );

  // Process data: by day of week
  const dayOfWeekData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day) => ({
      day,
      count: appointments.filter(
        (a) =>
          new Date(a.schedule).toLocaleString("default", {
            weekday: "short",
          }) === day,
      ).length,
    }),
  );

  // Process data: by status distribution
  const statusData = [
    {
      name: "Scheduled",
      value: appointments.filter((a) => a.status === "scheduled").length,
    },
    {
      name: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
    },
    {
      name: "Cancelled",
      value: appointments.filter((a) => a.status === "cancelled").length,
    },
  ];

  // Process data: by doctor
  const doctorData = appointments
    .reduce((acc: any[], appt) => {
      const existing = acc.find((d) => d.name === appt.primaryPhysician);
      if (existing) {
        existing.total += 1;
        if (appt.status === "scheduled") existing.scheduled += 1;
      } else {
        acc.push({
          name: `Dr. ${appt.primaryPhysician.split(" ").pop()}`,
          total: 1,
          scheduled: appt.status === "scheduled" ? 1 : 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Process data: hourly distribution
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8 AM to 7 PM
    const count = appointments.filter(
      (a) => new Date(a.schedule).getHours() === hour,
    ).length;
    return { hour: `${hour}:00`, count };
  });

  // Radial bar data (satisfaction/completion metrics)
  const radialData = [
    {
      name: "Scheduled Rate",
      value: Math.round(
        (appointments.filter((a) => a.status === "scheduled").length /
          Math.max(appointments.length, 1)) *
          100,
      ),
      fill: COLORS.scheduled,
    },
    {
      name: "Pending Rate",
      value: Math.round(
        (appointments.filter((a) => a.status === "pending").length /
          Math.max(appointments.length, 1)) *
          100,
      ),
      fill: COLORS.pending,
    },
    {
      name: "Cancelled Rate",
      value: Math.round(
        (appointments.filter((a) => a.status === "cancelled").length /
          Math.max(appointments.length, 1)) *
          100,
      ),
      fill: COLORS.cancelled,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-300 border-dark-500 rounded-lg border p-3 shadow-xl">
          <p className="text-12-medium text-dark-600 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-14-medium flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-dark-600">{entry.name}:</span>
              <span className="font-medium text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-dark-400 w-full space-y-6 rounded-2xl p-4 shadow-lg md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-18-bold text-white">Analytics & Insights</h3>
        <Tabs value={chartTab} onValueChange={setChartTab}>
          <TabsList className="bg-dark-300 border-dark-500 inline-flex h-8 rounded-xl border sm:gap-1 sm:p-1">
            <TabsTrigger
              value="trends"
              className="text-12-medium text-dark-700 data-[state=active]:bg-dark-600 hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:text-white sm:px-3"
            >
              Trends
            </TabsTrigger>
            <TabsTrigger
              value="distribution"
              className="text-12-medium text-dark-700 data-[state=active]:bg-dark-600 hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:text-white sm:px-3"
            >
              Distribution
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="text-12-medium text-dark-700 data-[state=active]:bg-dark-600 hover:bg-dark-500 rounded-md px-2 py-1 data-[state=active]:text-white sm:px-3"
            >
              Performance
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Trends Tab */}
      {chartTab === "trends" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trends - Area Chart */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Monthly Appointment Trends
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="colorScheduled"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.scheduled}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.scheduled}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.pending}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.pending}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#363A3D" />
                  <XAxis dataKey="month" stroke="#ABB8C4" fontSize={12} />
                  <YAxis stroke="#ABB8C4" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="scheduled"
                    stroke={COLORS.scheduled}
                    fill="url(#colorScheduled)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke={COLORS.pending}
                    fill="url(#colorPending)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Day of Week - Line Chart */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Appointments by Day
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#363A3D" />
                  <XAxis dataKey="day" stroke="#ABB8C4" fontSize={12} />
                  <YAxis stroke="#ABB8C4" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.completed}
                    strokeWidth={2}
                    dot={{ fill: COLORS.completed, r: 4 }}
                    activeDot={{
                      r: 6,
                      stroke: COLORS.completed,
                      strokeWidth: 2,
                      fill: "#1A1D21",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Tab */}
      {chartTab === "distribution" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status Distribution - Pie Chart */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Status Distribution
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-12-regular text-dark-600">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Distribution - Bar Chart */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Peak Hours (8AM-7PM)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#363A3D" />
                  <XAxis dataKey="hour" stroke="#ABB8C4" fontSize={12} />
                  <YAxis stroke="#ABB8C4" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {hourlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.count > 3 ? COLORS.scheduled : COLORS.total}
                        opacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {chartTab === "performance" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Doctor Performance - Horizontal Bar */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Top Doctors by Appointments
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#363A3D" />
                  <XAxis type="number" stroke="#ABB8C4" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#ABB8C4"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="total"
                    fill={COLORS.scheduled}
                    radius={[0, 4, 4, 0]}
                    opacity={0.9}
                  />
                  <Bar
                    dataKey="scheduled"
                    fill={COLORS.completed}
                    radius={[0, 4, 4, 0]}
                    opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Completion Rates - Radial Bar */}
          <div className="bg-dark-300 rounded-xl p-4">
            <h4 className="text-14-medium text-dark-600 mb-4">
              Appointment Completion Rates
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  barSize={15}
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background={{ fill: "#363A3D" }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend
                    iconSize={10}
                    formatter={(value) => (
                      <span className="text-12-regular text-dark-600">
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// utils/calendarUtils.js

import { AppointmentDB } from "@/types/appwrite.types";

export const generateCalendarLinks = (
  appointment: AppointmentDB,
  timeZone: string = "UTC",
) => {
  const startTime = new Date(appointment.schedule);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour appointment

  const formatGoogleCalendar = () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Appointment with Dr. ${appointment.primaryPhysician}`,
      dates: `${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      details: `Medical appointment at DocSync Inc.`,
      location: "DocSync Medical Center",
      ctz: timeZone || "UTC",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const formatOutlookCalendar = () => {
    const start = startTime.toISOString();
    const end = endTime.toISOString();
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=Appointment with Dr. ${appointment.primaryPhysician}&startdt=${start}&enddt=${end}&location=${encodeURIComponent("DocSync Medical Center")}&body=Medical appointment at DocSync Inc.`;
    return outlookUrl;
  };

  const formatYahooCalendar = () => {
    const st = `${startTime.getFullYear()}${String(startTime.getMonth() + 1).padStart(2, "0")}${String(startTime.getDate()).padStart(2, "0")}T${String(startTime.getHours()).padStart(2, "0")}${String(startTime.getMinutes()).padStart(2, "0")}00`;
    const et = `${endTime.getFullYear()}${String(endTime.getMonth() + 1).padStart(2, "0")}${String(endTime.getDate()).padStart(2, "0")}T${String(endTime.getHours()).padStart(2, "0")}${String(endTime.getMinutes()).padStart(2, "0")}00`;
    return `https://calendar.yahoo.com/?v=60&title=Appointment with Dr. ${appointment.primaryPhysician}&st=${st}&et=${et}&desc=Medical appointment at DocSync Inc.&in_loc=${encodeURIComponent("DocSync Medical Center")}`;
  };

  const downloadICSFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DocSync//Appointment//EN
BEGIN:VEVENT
UID:${appointment.$id || Date.now()}@docsync.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Appointment with Dr. ${appointment.primaryPhysician}
DESCRIPTION:Medical appointment at DocSync Inc.
LOCATION:DocSync Medical Center
END:VEVENT
END:VCALENDAR`;

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  };

  return {
    google: formatGoogleCalendar(),
    outlook: formatOutlookCalendar(),
    yahoo: formatYahooCalendar(),
    ics: downloadICSFile(),
  };
};

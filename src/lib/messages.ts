// emails/pending.email.ts

import { AppointmentDB, Patient } from "../../types/appwrite.types";
import { formatDateTime } from "./utils";
import { getBaseStyles } from "./emailStyles";
import { generateCalendarLinks } from "./calenderUtils";
import { getDirectionsLink } from "./locationUtils";

const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL;

interface EmailProps {
  appointment: AppointmentDB;
  timeZone: string;
  patient: Patient;
}

export const getPendingEmailHTML = ({
  appointment,
  timeZone,
  patient,
}: EmailProps): string => {
  const title = patient?.gender === "male" ? "Mr." : "Ms.";
  const firstName = patient?.name.split(" ")[0];
  const formattedDateTime = formatDateTime(
    appointment.schedule,
    timeZone,
  ).dateTime;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
      <title>Appointment Request Received - DocSync</title>
      ${getBaseStyles()}
    </head>
    <body>
      <div class="email-container">
        <div class="email-card">
          <div class="email-header">
            <div class="logo-wrapper">
              <img src="${LOGO_URL}" alt="DocSync" width="164" height="38" class="logo-img" />
            </div>
            <div class="badge-pending">⏳ PENDING REVIEW</div>
          </div>
          
          <div class="email-content">
            <div class="greeting">Dear ${title} ${firstName},</div>
            
            <div class="message">
              Thank you for choosing <strong style="color: #24ae7c;">DocSync</strong>. 
              Your appointment request has been received and is <strong>awaiting review</strong> by our medical team.
            </div>
            
            <div class="info-card info-card-accent-green">
              <div class="info-row">
                <div class="info-icon">📅</div>
                <div style="flex: 1;">
                  <div class="info-label">REQUESTED DATE & TIME</div>
                  <div class="info-value">${formattedDateTime}</div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon">👨‍⚕️</div>
                <div style="flex: 1;">
                  <div class="info-label">PHYSICIAN</div>
                  <div class="info-value">Dr. ${appointment.primaryPhysician}</div>
                </div>
              </div>
            </div>
            
            <div class="message" style="font-size: 14px; color: #76828d;">
              ✨ You'll receive a confirmation email once your appointment is approved. 
              Typically within 2-4 hours.
            </div>
            
            <div class="button-group">
              <a href="http://localhost.com/dashboard" class="btn btn-primary">View Appointment Status</a>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="footer-text">
              <strong>DocSync Inc.</strong> — Seamless healthcare coordination<br>
              This is an automated message, please do not reply directly.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// emails/confirmed.email.ts

export const getConfirmedEmailHTML = ({
  appointment,
  timeZone,
  patient,
}: EmailProps): string => {
  const title = patient?.gender === "male" ? "Mr." : "Ms.";
  const firstName = patient?.name.split(" ")[0];
  const formattedDateTime = formatDateTime(
    appointment.schedule,
    timeZone,
  ).dateTime;

  // Generate links properly
  const calendarLinks = generateCalendarLinks(appointment, timeZone);
  const directionsLinks = getDirectionsLink();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
      <title>Appointment Confirmed - DocSync</title>
      ${getBaseStyles()}
      <style>
        .confetti-bg {
          background: linear-gradient(135deg, rgba(36,174,124,0.05) 0%, rgba(121,181,236,0.05) 100%);
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-card">
          <div class="email-header confetti-bg">
            <div class="logo-wrapper">
              <img src="${LOGO_URL}" alt="DocSync" width="164" height="38" class="logo-img" />
            </div>
            <div class="badge-confirmed">✓ CONFIRMED</div>
          </div>
          
          <div class="email-content">
            <div class="greeting">Dear ${title} ${firstName},</div>
            
            <div class="message">
              🎉 <strong>Great news!</strong> Your appointment has been confirmed by our team.
            </div>
            
            <div class="info-card info-card-accent-blue">
              <div class="datetime-large">${formattedDateTime}</div>
              <div style="text-align: center; margin-top: 8px;">
                <span style="color: #76828d;">with</span>
                <div style="font-size: 20px; font-weight: 700; color: #e8e9e9; margin-top: 4px;">Dr. ${appointment.primaryPhysician}</div>
              </div>
            </div>
            
            <!-- Calendar Integration -->
            <div style="margin: 24px 0 16px;">
              <div style="text-align: center; margin-bottom: 12px;">
                <span style="color: #79b5ec; font-weight: 600;">📅 ADD TO CALENDAR</span>
              </div>
              <div class="calendar-grid">
                <a href="${calendarLinks.google}" class="cal-btn">🗓️ Google</a>
                <a href="${calendarLinks.outlook}" class="cal-btn">📧 Outlook</a>
                <a href="${calendarLinks.yahoo}" class="cal-btn">📆 Yahoo</a>
                <a href="${calendarLinks.ics}" download="appointment.ics" class="cal-btn">💾 Download ICS</a>
              </div>
            </div>
            
            <!-- Directions -->
            <div style="margin: 16px 0 24px;">
              <div style="text-align: center; margin-bottom: 12px;">
                <span style="color: #79b5ec; font-weight: 600;">🗺️ GET DIRECTIONS</span>
              </div>
              <div class="calendar-grid">
                <a href="${directionsLinks.google}" class="cal-btn">📍 Google Maps</a>
                <a href="${directionsLinks.apple}" class="cal-btn">🍎 Apple Maps</a>
                <a href="${directionsLinks.waze}" class="cal-btn">🚗 Waze</a>
              </div>
            </div>
            
            <!-- What to bring -->
            <div class="checklist">
              <div class="checklist-title">✓ PREPARATION CHECKLIST</div>
              <div class="checklist-item">🪪 Valid ID proof</div>
              <div class="checklist-item">📋 Previous medical records (if any)</div>
              <div class="checklist-item">💳 Insurance card (if applicable)</div>
              <div class="checklist-item">📝 List of current medications</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="message" style="font-size: 13px; text-align: center; color: #76828d;">
              ⏰ Need to reschedule? Update your appointment in the dashboard at least 48 hours before.
            </div>
          </div>
          
          <div class="email-footer">
            <div class="footer-text">
              <strong>DocSync Inc.</strong> — Your health, our priority<br>
              Need help? Contact us at support@docsync.com
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getCancelledEmailHTML = ({
  appointment,
  timeZone,
  patient,
}: EmailProps): string => {
  const title = patient?.gender === "male" ? "Mr." : "Ms.";
  const firstName = patient?.name.split(" ")[0];
  const formattedDateTime = formatDateTime(
    appointment.schedule,
    timeZone,
  ).dateTime;
  const cancellationReason =
    appointment.cancellationReason || "No specific reason provided";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
      <title>Appointment Cancelled - DocSync</title>
      ${getBaseStyles()}
    </head>
    <body>
      <div class="email-container">
        <div class="email-card">
          <div class="email-header">
            <div class="logo-wrapper">
              <img src="${LOGO_URL}" alt="DocSync" width="164" height="38" class="logo-img" />
            </div>
            <div class="badge-cancelled">✗ CANCELLED</div>
          </div>
          
          <div class="email-content">
            <div class="greeting">Dear ${title} ${firstName},</div>
            
            <div class="message">
              We regret to inform you that your appointment has been <strong style="color: #f37877;">cancelled</strong>.
            </div>
            
            <div class="info-card">
              <div class="info-row">
                <div class="info-icon">📅</div>
                <div style="flex: 1;">
                  <div class="info-label">ORIGINAL APPOINTMENT</div>
                  <div class="info-value">${formattedDateTime}</div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon">👨‍⚕️</div>
                <div style="flex: 1;">
                  <div class="info-label">PHYSICIAN</div>
                  <div class="info-value">Dr. ${appointment.primaryPhysician}</div>
                </div>
              </div>
            </div>
            
            <div class="reason-box">
              <div style="font-weight: 600; margin-bottom: 8px; color: #f37877;">📝 Cancellation Reason</div>
              <div style="color: #abb8c4;">${cancellationReason}</div>
            </div>
            
            <div class="checklist" style="background: rgba(243,120,119,0.05);">
              <div class="checklist-title">💡 What you can do next</div>
              <div class="checklist-item">📅 Book a new appointment online</div>
              <div class="checklist-item">📞 Call our support team for assistance</div>
              <div class="checklist-item">✉️ Email us for special arrangements</div>
            </div>
            
            <div class="button-group">
              <a href="${URL}/patients/${appointment.userId}/new-appointment" class="btn btn-primary">Book New Appointment</a>
              <a href="${URL}/support" class="btn btn-outline">Contact Support</a>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="footer-text">
              <strong>DocSync Inc.</strong> — Always here for you<br>
              We apologize for any inconvenience caused.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

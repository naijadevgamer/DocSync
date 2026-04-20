// emails/emailStyles.ts

export const getBaseStyles = () => `
  <style>
    /* Reset & Base */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #f5f7fa;
      padding: 40px 20px;
    }
    
    /* Card - LIGHT BACKGROUND */
    .email-card {
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    /* Header */
    .email-header {
      padding: 40px 32px 24px;
      text-align: center;
      border-bottom: 1px solid #eef2f6;
    }
    
    /* Logo */
    .logo-wrapper {
      margin-bottom: 24px;
    }
    
    .logo-img {
      max-width: 180px;
      height: auto;
      display: inline-block;
    }
    
    /* Badge styles using your colors - LIGHT VERSION */
    .badge-pending {
      display: inline-block;
      background: #e8f5ef;
      color: #24ae7c;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .badge-confirmed {
      display: inline-block;
      background: #eef3fc;
      color: #79b5ec;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .badge-cancelled {
      display: inline-block;
      background: #fef0f0;
      color: #f37877;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    /* Content */
    .email-content {
      padding: 32px;
    }
    
    /* Typography - DARK TEXT on LIGHT background */
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a1d21;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1a1d21;
      margin-bottom: 16px;
    }
    
    .message {
      color: #5a6e7c;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    
    /* Info Cards - LIGHT VERSION */
    .info-card {
      background: #f8fafc;
      border-radius: 20px;
      padding: 24px;
      margin: 24px 0;
      border: 1px solid #eef2f6;
    }
    
    .info-card-accent-green {
      border-top: 3px solid #24ae7c;
    }
    
    .info-card-accent-blue {
      border-top: 3px solid #79b5ec;
    }
    
    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eef2f6;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-icon {
      font-size: 20px;
      min-width: 32px;
    }
    
    .info-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #8a9aa8;
      margin-bottom: 4px;
    }
    
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1d21;
    }
    
    /* Large datetime display */
    .datetime-large {
      font-size: 26px;
      font-weight: 700;
      color: #24ae7c;
      text-align: center;
      margin: 16px 0;
      letter-spacing: -0.5px;
    }
    
    /* Button Group - Responsive */
    .button-group {
      margin: 32px 0 24px;
      text-align: center;
    }
    
    .btn {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.2s ease;
      margin: 4px;
      text-align: center;
    }
    
    .btn-primary {
      background: #24ae7c;
      color: #ffffff !important;
    }
    
    .btn-secondary {
      background: #eef2f6;
      color: #1a1d21 !important;
    }
    
    .btn-outline {
      background: transparent;
      border: 1px solid #dce3e9;
      color: #5a6e7c !important;
    }
    
    /* Calendar mini buttons - LIGHT VERSION */
    .calendar-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin: 16px 0;
    }
    
    .cal-btn {
      display: inline-block;
      padding: 8px 14px;
      background: #f8fafc;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      color: #5a6e7c;
      border: 1px solid #e2e8f0;
    }
    
    /* What to bring list - LIGHT VERSION */
    .checklist {
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px;
      margin: 24px 0;
      border: 1px solid #eef2f6;
    }
    
    .checklist-title {
      font-size: 14px;
      font-weight: 600;
      color: #24ae7c;
      margin-bottom: 12px;
    }
    
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      color: #5a6e7c;
      font-size: 14px;
    }
    
    /* Reason box for cancellation - LIGHT VERSION */
    .reason-box {
      background: #fef8f8;
      border-left: 3px solid #f37877;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    
    /* Divider */
    .divider {
      height: 1px;
      background: #eef2f6;
      margin: 24px 0;
    }
    
    /* Footer - LIGHT VERSION */
    .email-footer {
      padding: 24px 32px;
      background: #fafcfc;
      text-align: center;
      border-top: 1px solid #eef2f6;
    }
    
    .footer-text {
      font-size: 12px;
      color: #8a9aa8;
      line-height: 1.5;
    }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 20px 12px;
      }
      
      .email-header {
        padding: 32px 20px 20px;
      }
      
      .email-content {
        padding: 24px 20px;
      }
      
      .email-footer {
        padding: 20px 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .greeting {
        font-size: 16px;
      }
      
      .message {
        font-size: 14px;
      }
      
      .datetime-large {
        font-size: 20px;
      }
      
      .btn {
        display: block;
        margin: 8px 0;
        padding: 12px 20px;
      }
      
      .calendar-grid {
        gap: 6px;
      }
      
      .cal-btn {
        padding: 6px 10px;
        font-size: 11px;
      }
      
      .info-row {
        flex-direction: column;
        gap: 4px;
      }
      
      .info-icon {
        font-size: 18px;
      }
    }
  </style>
`;

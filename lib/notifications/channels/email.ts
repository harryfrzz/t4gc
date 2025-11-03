/**
 * Email Notification Channel
 * Handles all email sending logic using Resend (with fallback support)
 * 
 * ====================================
 * 🔧 SETUP INSTRUCTIONS
 * ====================================
 * 
 * To enable email notifications, you need to:
 * 
 * 1. Get a Resend API Key:
 *    - Sign up at https://resend.com
 *    - Go to https://resend.com/api-keys
 *    - Create an API key and copy it
 * 
 * 2. Add the API key to your .env.local file:
 *    RESEND_API_KEY=re_your_actual_api_key_here
 * 
 * 3. Configure the sender email address:
 *    
 *    FOR TESTING (Resend free tier):
 *    - Use the default "onboarding@resend.dev" (already set below)
 *    - Emails can ONLY be sent to YOUR verified email address
 *    - To test: temporarily change recipient to your email in the code
 *    
 *    FOR PRODUCTION (send to any email):
 *    - Verify your domain at https://resend.com/domains
 *    - Add DNS records (SPF, DKIM) to your domain
 *    - Set EMAIL_FROM in .env.local:
 *      EMAIL_FROM=noreply@yourdomain.com
 *    - Now you can send to any recipient
 * 
 * 4. Optional: For testing with free tier, you can modify line ~96 below:
 *    Change: to: recipient,
 *    To:     to: "your-verified-email@gmail.com",  // Testing only
 *    
 *    This sends all emails to your verified address during development.
 *    Remember to change it back before production!
 * 
 * ====================================
 */

import { NotificationPayload, NotificationResult, EmailNotificationData } from "../types";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
// Use Resend's onboarding sender as a safe default for testing if none provided
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_EMAIL_FROM || "onboarding@resend.dev";
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "resend";

/**
 * Send email notification using Resend API
 */
export async function sendEmailViaResend(
  data: EmailNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured. Please set it in your environment variables.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: data.from || EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Try to provide a more actionable error message
      const detailed =
        (result && (result.error?.message || result.message || result.detail)) ||
        `HTTP ${response.status}: ${response.statusText}`;

      let hint = "";
      if (response.status === 401 || response.status === 403) {
        hint = " (invalid or missing RESEND_API_KEY)";
      } else if (response.status === 422) {
        hint = " (unverified or invalid 'from' address)";
      }

      return {
        success: false,
        error: `Resend API error: ${detailed}${hint}`,
      };
    }

    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    };
  }
}

/**
 * Send email notification (main entry point for email channel)
 */
export async function sendEmailNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const { recipient, type, payload: data } = payload;

  // Generate email content based on notification type
  const emailContent = generateEmailContent(type, data);

  if (!emailContent) {
    return {
      success: false,
      status: "failed",
      channel: "email",
      timestamp: new Date(),
      error: `No email template found for notification type: ${type}`,
    };
  }

  // Send email based on configured service
  let emailResult;
  if (EMAIL_SERVICE === "resend") {
    emailResult = await sendEmailViaResend({
      to: recipient, // 🔧 TESTING: Change to your verified email if using Resend free tier
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      from: EMAIL_FROM,
    });
  } else {
    return {
      success: false,
      status: "failed",
      channel: "email",
      timestamp: new Date(),
      error: `Unsupported email service: ${EMAIL_SERVICE}. Supported services: resend`,
    };
  }

  return {
    success: emailResult.success,
    notificationId: emailResult.messageId,
    status: emailResult.success ? "sent" : "failed",
    channel: "email",
    timestamp: new Date(),
    error: emailResult.error,
  };
}

/**
 * Generate email content based on notification type
 */
function generateEmailContent(
  type: NotificationPayload["type"],
  data: NotificationPayload["payload"]
): { subject: string; html: string; text: string } | null {
  switch (type) {
    case "PARTICIPANT_APPROVED":
      return {
        subject: `Welcome to Y-Ultimate! Your participation has been approved`,
        html: getApprovalEmailTemplate(data),
        text: getApprovalEmailText(data),
      };

    case "PARTICIPANT_REMOVED":
      return {
        subject: `Update regarding your Y-Ultimate participation`,
        html: getRemovalEmailTemplate(data),
        text: getRemovalEmailText(data),
      };

    case "PARTICIPANT_ADDED":
    case "TEAM_ADDED":
      return {
        subject: `Welcome to Y-Ultimate! Registration received`,
        html: getWelcomeEmailTemplate(data),
        text: getWelcomeEmailText(data),
      };

    default:
      return null;
  }
}

function getApprovalEmailTemplate(data: NotificationPayload["payload"]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🎉 Participation Approved!</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hi ${data.name || "there"},</p>
    <p>Great news! Your participation in Y-Ultimate has been <strong>approved</strong>.</p>
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0;"><strong>Team:</strong> ${data.team || "N/A"}</p>
      <p style="margin: 5px 0;"><strong>Role:</strong> ${data.role || "N/A"}</p>
    </div>
    <p>We're excited to have you as part of our community. Stay tuned for updates about upcoming events and tournaments!</p>
    <p>If you have any questions, feel free to reach out to us.</p>
    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>The Y-Ultimate Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

function getApprovalEmailText(data: NotificationPayload["payload"]): string {
  return `
Hi ${data.name || "there"},

Great news! Your participation in Y-Ultimate has been approved.

Team: ${data.team || "N/A"}
Role: ${data.role || "N/A"}

We're excited to have you as part of our community. Stay tuned for updates about upcoming events and tournaments!

Best regards,
The Y-Ultimate Team
  `.trim();
}

function getRemovalEmailTemplate(data: NotificationPayload["payload"]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f44336; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Participation Update</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hi ${data.name || "there"},</p>
    <p>We're writing to inform you that your participation in Y-Ultimate has been removed.</p>
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336;">
      <p style="margin: 0;"><strong>Team:</strong> ${data.team || "N/A"}</p>
      <p style="margin: 5px 0;"><strong>Role:</strong> ${data.role || "N/A"}</p>
    </div>
    ${data.message ? `<p style="font-style: italic; color: #666;">${data.message}</p>` : ""}
    <p>If you believe this is an error or have any questions, please contact us.</p>
    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>The Y-Ultimate Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

function getRemovalEmailText(data: NotificationPayload["payload"]): string {
  return `
Hi ${data.name || "there"},

We're writing to inform you that your participation in Y-Ultimate has been removed.

Team: ${data.team || "N/A"}
Role: ${data.role || "N/A"}

${data.message ? `Note: ${data.message}\n` : ""}
If you believe this is an error or have any questions, please contact us.

Best regards,
The Y-Ultimate Team
  `.trim();
}

function getWelcomeEmailTemplate(data: NotificationPayload["payload"]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Welcome to Y-Ultimate! 🎯</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hi ${data.name || "there"},</p>
    <p>Thank you for registering with Y-Ultimate! We've received your registration and it's currently being reviewed.</p>
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0;"><strong>Team:</strong> ${data.team || "N/A"}</p>
      <p style="margin: 5px 0;"><strong>Role:</strong> ${data.role || "N/A"}</p>
    </div>
    <p>You'll receive another email once your participation has been approved. In the meantime, if you have any questions, feel free to reach out to us.</p>
    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>The Y-Ultimate Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

function getWelcomeEmailText(data: NotificationPayload["payload"]): string {
  return `
Hi ${data.name || "there"},

Thank you for registering with Y-Ultimate! We've received your registration and it's currently being reviewed.

Team: ${data.team || "N/A"}
Role: ${data.role || "N/A"}

You'll receive another email once your participation has been approved. In the meantime, if you have any questions, feel free to reach out to us.

Best regards,
The Y-Ultimate Team
  `.trim();
}



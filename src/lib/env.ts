/**
 * Environment Variable Validator for ToolVerse Backend (Nodemailer Gmail SMTP)
 */

export interface EnvVars {
  databaseUrl: string | undefined;
  emailUser: string | undefined;
  emailPass: string | undefined;
  adminEmail: string;
  isSmtpConfigured: boolean;
}

export function validateAndGetEnv(): EnvVars {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "krishsavaliya018@gmail.com";

  const isSmtpConfigured = Boolean(emailUser && emailPass && adminEmail);

  if (!emailUser || !emailPass) {
    console.warn(
      `[ToolVerse Environment Warning]: EMAIL_USER (${emailUser ? "set" : "missing"}), EMAIL_PASS (${emailPass ? "set" : "missing"})`
    );
  }

  return {
    databaseUrl,
    emailUser,
    emailPass,
    adminEmail,
    isSmtpConfigured,
  };
}

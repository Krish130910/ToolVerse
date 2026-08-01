/**
 * Environment Variable Validator for ToolVerse Backend
 */

export interface EnvVars {
  databaseUrl: string | undefined;
  resendApiKey: string | undefined;
  adminEmail: string;
}

export function validateAndGetEnv(): EnvVars {
  const databaseUrl = process.env.DATABASE_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "krishsavaliya018@gmail.com";

  const missingVars: string[] = [];

  if (!databaseUrl || databaseUrl.includes("your_neon_database_url")) {
    missingVars.push("DATABASE_URL");
  }

  if (!resendApiKey || resendApiKey.includes("your_resend_api_key")) {
    missingVars.push("RESEND_API_KEY");
  }

  if (!process.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL.includes("your-email@example.com")) {
    missingVars.push("ADMIN_EMAIL");
  }

  if (missingVars.length > 0) {
    console.error(
      `[ToolVerse Environment Warning]: The following environment variables are missing or unconfigured: ${missingVars.join(
        ", "
      )}. Please set them in .env.local to enable full database persistence and email notifications.`
    );
  }

  return {
    databaseUrl,
    resendApiKey,
    adminEmail,
  };
}

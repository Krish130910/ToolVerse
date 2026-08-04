export type JWTStatus = "valid" | "warning" | "expired" | "malformed";

export interface JWTClaims {
  alg?: string;
  typ?: string;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  iat?: number;
  iatFormatted?: string;
  nbf?: number;
  nbfFormatted?: string;
  exp?: number;
  expFormatted?: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  timeRemaining?: string;
  tokenAge?: string;
}

export interface JWTValidationResult {
  status: JWTStatus;
  statusLabel: string;
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  rawHeader: string;
  rawPayload: string;
  signature: string;
  parts: string[];
  errors: string[];
  warnings: string[];
  claims: JWTClaims;
}

export interface JWTSample {
  id: string;
  name: string;
  description: string;
  token: string;
}

export interface UserSession {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}

export interface SessionPayload {
  user: UserSession;
  exp: number;
}

export const SESSION_COOKIE_NAME = "meezan_session";

const DEFAULT_SECRET = "meezan-oil-default-secret-key-2026-field-sales";

function getSecretKey(): string {
  return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function base64UrlEncode(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function createSessionToken(user: UserSession, remember = false): Promise<string> {
  const secret = getSecretKey();
  const key = await getHmacKey(secret);
  const encoder = new TextEncoder();

  // 30 days if remember is true, otherwise 7 days
  const expiresInSeconds = remember ? 30 * 86400 : 7 * 86400;
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const payload: SessionPayload = { user, exp };
  const payloadJson = JSON.stringify(payload);
  const payloadBytes = encoder.encode(payloadJson);
  const encodedPayload = base64UrlEncode(payloadBytes);

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    if (!token?.includes(".")) {
      return null;
    }

    const [encodedPayload, encodedSignature] = token.split(".");
    if (!encodedPayload || !encodedSignature) {
      return null;
    }

    const secret = getSecretKey();
    const key = await getHmacKey(secret);
    const encoder = new TextEncoder();

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as ArrayBuffer,
      encoder.encode(encodedPayload),
    );

    if (!isValid) {
      return null;
    }

    const payloadBytes = base64UrlDecode(encodedPayload);
    const decoder = new TextDecoder();
    const payloadText = decoder.decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadText);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload.user;
  } catch {
    return null;
  }
}

import "server-only";

// Đăng nhập Google (OAuth 2.0 / OpenID Connect, luồng authorization code).
// Cần GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET (tạo trong Google Cloud Console → APIs & Services → Credentials).

export const OAUTH_STATE_COOKIE = "nla_oauth_state";

export function googleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const q = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

export type GoogleProfile = { email: string; emailVerified: boolean; name?: string; picture?: string };

function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const part = jwt.split(".")[1] ?? "";
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

/**
 * Đổi mã `code` lấy id_token. id_token nhận trực tiếp từ máy chủ token của Google qua HTTPS
 * nên được tin cậy (OpenID Connect Core §3.1.3.7); vẫn kiểm tra aud, iss và hạn dùng.
 */
export async function exchangeCode(code: string, clientId: string, clientSecret: string, redirectUri: string): Promise<GoogleProfile> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  if (!res.ok) throw new Error(`Google token error ${res.status}`);
  const tok = (await res.json()) as { id_token?: string };
  if (!tok.id_token) throw new Error("Google không trả id_token");
  const p = decodeJwtPayload(tok.id_token);
  const iss = String(p.iss ?? "");
  if (p.aud !== clientId || !(iss === "https://accounts.google.com" || iss === "accounts.google.com")) throw new Error("id_token không hợp lệ");
  if (typeof p.exp !== "number" || p.exp * 1000 < Date.now()) throw new Error("id_token hết hạn");
  return {
    email: String(p.email ?? "").toLowerCase(),
    emailVerified: p.email_verified === true || p.email_verified === "true",
    name: typeof p.name === "string" ? p.name : undefined,
    picture: typeof p.picture === "string" ? p.picture : undefined,
  };
}

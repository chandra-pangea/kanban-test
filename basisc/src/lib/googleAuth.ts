/** Google OAuth2 JWT from GIS `credential` response — optional fields per account type. */
interface GoogleJwtPayload {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());
}

export function getGoogleClientId(): string | undefined {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  return id || undefined;
}

export function decodeGoogleCredentialPayload(credential: string): { name: string; email: string } | null {
  try {
    const parts = credential.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";
    else if (pad === 1) return null;
    const json = atob(base64);
    const data = JSON.parse(json) as GoogleJwtPayload;
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    if (!email) return null;
    let name =
      typeof data.name === "string" && data.name.trim()
        ? data.name.trim()
        : [data.given_name, data.family_name]
            .filter((x): x is string => typeof x === "string" && x.trim() !== "")
            .join(" ");
    if (!name) {
      name = email.split("@")[0] ?? "User";
    }
    return { name, email };
  } catch {
    return null;
  }
}

const GSI_SCRIPT_ID = "google-gsi-client";

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as Window & { google?: { accounts?: { id?: unknown } } };
  if (w.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Sign-In script failed to load")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.id = GSI_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error("Google Sign-In script failed to load"));
    document.head.appendChild(script);
  });
}

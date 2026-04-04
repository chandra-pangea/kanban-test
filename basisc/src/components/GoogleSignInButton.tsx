import { useEffect, useLayoutEffect, useRef } from "react";
import {
  decodeGoogleCredentialPayload,
  getGoogleClientId,
  isGoogleAuthConfigured,
  loadGoogleIdentityScript,
} from "../lib/googleAuth";

interface GoogleSignInButtonProps {
  onSuccess: (profile: { name: string; email: string }) => void;
  onError?: (message: string) => void;
}

/** Renders the official Google button when `VITE_GOOGLE_CLIENT_ID` is set; otherwise renders nothing. */
export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useLayoutEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!isGoogleAuthConfigured()) return;
    const clientId = getGoogleClientId();
    if (!clientId) return;

    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      try {
        await loadGoogleIdentityScript();
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        if (cancelled || !containerRef.current) return;

        type Gsi = {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: { credential: string }) => void;
              }) => void;
              renderButton: (
                parent: HTMLElement,
                options: { type: string; theme: string; size: string; text: string; width: string | number },
              ) => void;
            };
          };
        };

        const google = (window as Window & { google?: Gsi }).google;
        if (!google?.accounts?.id) {
          onErrorRef.current?.("Google Sign-In is unavailable.");
          return;
        }

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const profile = decodeGoogleCredentialPayload(response.credential);
            if (!profile) {
              onErrorRef.current?.("Could not read your Google profile. Try again.");
              return;
            }
            onSuccessRef.current(profile);
          },
        });

        const width = Math.max(containerRef.current.offsetWidth, 320);
        google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          width,
        });
      } catch {
        onErrorRef.current?.("Could not load Google Sign-In.");
      }
    })();

    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, []);

  if (!isGoogleAuthConfigured()) return null;

  return (
    <div
      ref={containerRef}
      className="flex min-h-[44px] w-full justify-center [&>div]:!w-full"
      data-testid="google-sign-in-button"
    />
  );
}

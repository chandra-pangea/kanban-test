/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, login and register pages show “Continue with Google” (Google Identity Services). */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

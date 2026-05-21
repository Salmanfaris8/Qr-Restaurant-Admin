// vite-env.d.ts or a separate .d.ts file
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // readonly VITE_API_URL_IMG: string;
  // readonly VITE_WHATSAPP_NUMBER: string;  // ✅ add this
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
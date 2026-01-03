/// <reference types="vite/client" />

interface Window {
  webkitAudioContext: typeof AudioContext;
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_API_KEY_DEV: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_AUTH_DOMAIN_DEV: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_PROJECT_ID_DEV: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_STORAGE_BUCKET_DEV: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID_DEV: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_APP_ID_DEV: string
  readonly VITE_STRIPE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

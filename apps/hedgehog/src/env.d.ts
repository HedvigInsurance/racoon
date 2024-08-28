/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean
  readonly NEXT_PUBLIC_AUTH_HOST: string
  readonly NEXT_PUBLIC_API_URL: string
  readonly NEXT_PUBLIC_HEDVIG_COM: string
  readonly NEXT_PUBLIC_HEDVIG_APP: string
  readonly NEXT_PUBLIC_STAGING_TOOLS_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  /** Ключ Web3Forms: листи з домашніми завданнями приходять на пошту, до якої прив'язаний ключ */
  readonly VITE_WEB3FORMS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export const APP_VIEWS = [
  'dashboard', 'reports', 'games', 'settings', 'login', 'logout', 'select'
] as const;

export type AppView = typeof APP_VIEWS[number];
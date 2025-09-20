export {};

declare global {
  interface Window {
    __APOF_ANALYTICS_ENABLED?: boolean;
    __APOF_MARKETING_ENABLED?: boolean;
  }
}

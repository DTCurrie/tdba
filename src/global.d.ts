export {};

declare global {
  interface Window {
    debug: Record<string, unknown>;
  }
}

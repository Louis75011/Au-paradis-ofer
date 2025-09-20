// CookiePrefsDialog.stories.tsx
import CookiePrefsDialog from "./CookiePrefsDialog";
export default { title: "Cookie / CookiePrefsDialog" };
export const Open = () => {
  // ouvrir via event
  setTimeout(() => document.dispatchEvent(new CustomEvent("open-cookieprefs")), 10);
  return <CookiePrefsDialog />;
};

// apps/frontend/lib/scriptUtils.ts
export function injectScript({ id, src, async = true, onLoad }: { id: string; src: string; async?: boolean; onLoad?: () => void }) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = async;
  s.src = src;
  if (onLoad) s.onload = onLoad;
  document.head.appendChild(s);
}

export function removeScript(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.remove();
}

export function removeCookies(names: string[]) {
  names.forEach((n) => {
    // supprimer cookie sur path=/ ; pour domaine, adapter si besoin
    document.cookie = `${n}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    // tentative côté domaine racine :
    try {
      const hostname = window.location.hostname;
      document.cookie = `${n}=; Path=/; Domain=${hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    } catch {}
  });
}

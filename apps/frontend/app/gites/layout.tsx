// app/gites/layout.tsx (SERVER, pas de "use client")
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gîte (à venir)",
};

export default function GitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

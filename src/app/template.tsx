import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

// Un template est remonté à chaque navigation : le menu mobile (<details>)
// se referme donc sans aucun JavaScript client.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
    </>
  );
}

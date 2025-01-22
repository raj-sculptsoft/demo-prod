import Header from "@/components/layout/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        nodes={[
          { name: "Settings", href: "/settings" },
          { name: "Semgrep", href: `/settings/semgrep` },
          // { name: "Synk", href: `/settings/synk` },
        ]}
      />

      {children}
    </>
  );
}

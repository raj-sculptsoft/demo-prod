import Header from "@/components/layout/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        nodes={[
          { name: "Settings", href: "/settings" },
          { name: "Semgrep", href: "/settings/semgrep" },
          { name: "Link Assets", href: "/settings/semgrep/linkAssets" },
        ]}
      />

      {children}
    </>
  );
}

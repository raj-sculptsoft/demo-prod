import Header from "@/components/layout/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header nodes={[{ name: "Upload Report", href: "/upload-report" }]} />
      {children}
    </>
  );
}

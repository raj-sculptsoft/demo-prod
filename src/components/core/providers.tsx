import { SidebarProvider } from "@/components/ui/sidebar";
import { AppStore, default as makeStore } from "@/store/store";
import React, { useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
    </ReduxProvider>
  );
}

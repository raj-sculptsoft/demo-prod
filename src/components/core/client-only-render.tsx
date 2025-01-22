"use client";

import useIsClient from "@/hooks/use-is-client";

const ClientOnlyRender = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient();

  return isClient && children;
};

export default ClientOnlyRender;

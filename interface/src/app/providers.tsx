"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { config, projectId } from "@app/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
});

const styles = {
  global: {
    body: {
      bg: "#1A202C",
      color: "#EDF2F7",
    },
  },
};

const themeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config: themeConfig, styles });

export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}

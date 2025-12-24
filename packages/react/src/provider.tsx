"use client";

import { createContext, useContext, ReactNode } from "react";
import { MpesaConfig } from "./types";

const MpesaContext = createContext<MpesaConfig | undefined>(undefined);

export interface MpesaProviderProps {
  children: ReactNode;
  config?: MpesaConfig;
}

/**
 * Provider for M-Pesa configuration
 *
 * @example
 * ```tsx
 * import { MpesaProvider } from "@singularity-payments/react";
 *
 * function App() {
 *   return (
 *     <MpesaProvider config={{ baseUrl: "/api/mpesa" }}>
 *       <YourApp />
 *     </MpesaProvider>
 *   );
 * }
 * ```
 */
export function MpesaProvider({ children, config = {} }: MpesaProviderProps) {
  const defaultConfig: MpesaConfig = {
    baseUrl: "/api/mpesa",
    pollInterval: 3000,
    pollTimeout: 120000,
    fetcher: fetch,
    ...config,
  };

  return (
    <MpesaContext.Provider value={defaultConfig}>
      {children}
    </MpesaContext.Provider>
  );
}

export function useMpesaConfig(): MpesaConfig {
  const context = useContext(MpesaContext);

  // Return defaults if no provider
  if (!context) {
    return {
      baseUrl: "/api/mpesa",
      pollInterval: 3000,
      pollTimeout: 120000,
      fetcher: fetch,
    };
  }

  return context;
}

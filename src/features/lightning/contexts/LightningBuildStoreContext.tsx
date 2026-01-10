"use client";

import { createContext, type ReactNode,useContext, useRef } from "react";

import { type StoreApi,useStore } from "zustand";

import { createLightningBuildStore, type LightningBuildState } from "../store/lightningBuildStore";

export const LightningBuildStoreContext = createContext<StoreApi<LightningBuildState> | null>(null);

export const LightningBuildStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<LightningBuildState>>(null);
  
  if (!storeRef.current) {
    storeRef.current = createLightningBuildStore();
  }

  return (
    <LightningBuildStoreContext.Provider value={storeRef.current}>
      {children}
    </LightningBuildStoreContext.Provider>
  );
};

export const useLightningBuildStore = <T,>(
  selector: (state: LightningBuildState) => T
): T => {
  const store = useContext(LightningBuildStoreContext);
  
  if (!store) {
    throw new Error("useLightningBuildStore must be used within LightningBuildStoreProvider");
  }
  
  return useStore(store, selector);
};

export const useLightningBuildStoreApi = () => {
  const store = useContext(LightningBuildStoreContext);
  
  if (!store) {
    throw new Error("useLightningBuildStoreApi must be used within LightningBuildStoreProvider");
  }
  
  return store;
};

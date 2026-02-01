import React, { createContext, useContext, useState } from "react";

export type EntryOverlayContextValue = {
  showEntryOption: boolean;
  setShowEntryOption: (show: boolean) => void;
};

const EntryOverlayContext = createContext<EntryOverlayContextValue | null>(
  null,
);

export const useEntryOverlay = () => {
  const ctx = useContext(EntryOverlayContext);
  if (!ctx)
    throw new Error("useEntryOverlay must be used within EntryOverlayProvider");
  return ctx;
};

export const EntryOverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showEntryOption, setShowEntryOption] = useState<boolean>(false);
  const value: EntryOverlayContextValue = {
    showEntryOption,
    setShowEntryOption,
  };
  return (
    <EntryOverlayContext.Provider value={value}>
      {children}
    </EntryOverlayContext.Provider>
  );
};

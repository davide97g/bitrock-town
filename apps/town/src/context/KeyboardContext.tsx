import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface KeyboardContextType {
  keys: Record<string, boolean>;
}

const KeyboardContext = createContext<KeyboardContextType>({ keys: {} });

export const useKeyboard = () => useContext(KeyboardContext);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <KeyboardContext.Provider value={{ keys }}>
      {children}
    </KeyboardContext.Provider>
  );
};

"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { officeObjects } from "../data/officeObjects";

interface Position {
  x: number;
  y: number;
}

interface AvatarContextType {
  position: Position;
  moveAvatar: (direction: Position) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};

interface AvatarProviderProps {
  children: React.ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  const [position, setPosition] = useState<Position>({ x: 10, y: 10 });

  // Check if a position is occupied by an office object
  const isPositionOccupied = useCallback((pos: Position) => {
    return officeObjects.some((obj) => {
      return (
        pos.x >= obj.position.x &&
        pos.x < obj.position.x + obj.width &&
        pos.y >= obj.position.y &&
        pos.y < obj.position.y + obj.height
      );
    });
  }, []);

  // Move avatar in the specified direction
  const moveAvatar = useCallback(
    (direction: Position) => {
      setPosition((prev) => {
        const newPos = {
          x: prev.x + direction.x,
          y: prev.y + direction.y,
        };

        // Check boundaries (50x30 grid)
        if (newPos.x < 0 || newPos.x >= 50 || newPos.y < 0 || newPos.y >= 30) {
          return prev;
        }

        // Check collision with office objects
        if (isPositionOccupied(newPos)) {
          return prev;
        }

        return newPos;
      });
    },
    [isPositionOccupied]
  );

  return (
    <AvatarContext.Provider value={{ position, moveAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

"use client";

import Avatar from "@/components/custom/Avatar";
import OfficeItem from "@/components/custom/OfficeItem";

import type React from "react";
import { useEffect, useRef, useState } from "react";

// Office layout configuration
const officeItems = [
  { id: 1, type: "desk", x: 100, y: 150, width: 120, height: 60 },
  { id: 2, type: "desk", x: 300, y: 150, width: 120, height: 60 },
  { id: 3, type: "desk", x: 500, y: 150, width: 120, height: 60 },
  { id: 4, type: "desk", x: 100, y: 300, width: 120, height: 60 },
  { id: 5, type: "desk", x: 300, y: 300, width: 120, height: 60 },
  { id: 6, type: "desk", x: 500, y: 300, width: 120, height: 60 },
  { id: 7, type: "table", x: 300, y: 450, width: 150, height: 80 },
  { id: 8, type: "coffee", x: 600, y: 400, width: 50, height: 50 },
  { id: 9, type: "plant", x: 50, y: 50, width: 40, height: 40 },
  { id: 10, type: "plant", x: 550, y: 50, width: 40, height: 40 },
];

const VirtualSpace: React.FC = () => {
  const [position, setPosition] = useState({ x: 300, y: 200 });
  const spaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 10;
      const newPosition = { ...position };

      switch (e.key) {
        case "ArrowUp":
          newPosition.y = Math.max(0, position.y - step);
          break;
        case "ArrowDown":
          newPosition.y = Math.min(
            spaceRef.current?.clientHeight || 600,
            position.y + step
          );
          break;
        case "ArrowLeft":
          newPosition.x = Math.max(0, position.x - step);
          break;
        case "ArrowRight":
          newPosition.x = Math.min(
            spaceRef.current?.clientWidth || 800,
            position.x + step
          );
          break;
        default:
          return;
      }

      // Check for collisions with office items
      const avatarSize = 40;
      const hasCollision = officeItems.some((item) => {
        return (
          newPosition.x < item.x + item.width &&
          newPosition.x + avatarSize > item.x &&
          newPosition.y < item.y + item.height &&
          newPosition.y + avatarSize > item.y
        );
      });

      if (!hasCollision) {
        setPosition(newPosition);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position]);

  return (
    <div className="virtual-space" ref={spaceRef}>
      <div className="office-background">
        {officeItems.map((item) => (
          <OfficeItem
            key={item.id}
            type={item.type}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
          />
        ))}
      </div>
      <Avatar x={position.x} y={position.y} />
    </div>
  );
};

export default VirtualSpace;

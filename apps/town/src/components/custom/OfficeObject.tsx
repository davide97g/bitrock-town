import type React from "react";
import "../styles/OfficeObject.css";

interface OfficeObjectProps {
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

const GRID_SIZE = 32; // Size of each grid cell in pixels

const OfficeObject: React.FC<OfficeObjectProps> = ({
  type,
  position,
  width,
  height,
}) => {
  const getObjectIcon = (type: string) => {
    switch (type) {
      case "desk":
        return "🖥️";
      case "table":
        return "📋";
      case "coffee":
        return "☕";
      case "plant":
        return "🪴";
      case "chair":
        return "🪑";
      case "whiteboard":
        return "📊";
      case "bookshelf":
        return "📚";
      default:
        return "📦";
    }
  };

  const getObjectClass = (type: string) => {
    return `office-object office-object-${type}`;
  };

  return (
    <div
      className={getObjectClass(type)}
      style={{
        left: `${position.x * GRID_SIZE}px`,
        top: `${position.y * GRID_SIZE}px`,
        width: `${width * GRID_SIZE}px`,
        height: `${height * GRID_SIZE}px`,
      }}
    >
      <div className="object-icon">{getObjectIcon(type)}</div>
      <div className="object-label">{type}</div>
    </div>
  );
};

export default OfficeObject;

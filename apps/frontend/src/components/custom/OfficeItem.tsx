import type React from "react";

interface OfficeItemProps {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const OfficeItem: React.FC<OfficeItemProps> = ({
  type,
  x,
  y,
  width,
  height,
}) => {
  const getItemStyle = () => {
    switch (type) {
      case "desk":
        return "office-item-desk";
      case "table":
        return "office-item-table";
      case "coffee":
        return "office-item-coffee";
      case "plant":
        return "office-item-plant";
      case "avatar":
        return "office-item-avatar";
      default:
        return "";
    }
  };

  return (
    <div
      className={`office-item ${getItemStyle()}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {type === "coffee" && (
        <div className="coffee-steam">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
};

export default OfficeItem;

import type React from "react";

interface AvatarProps {
  x: number;
  y: number;
}

const Avatar: React.FC<AvatarProps> = ({ x, y }) => {
  return (
    <div
      className="avatar"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="avatar-body"></div>
      <div className="avatar-name">You</div>
    </div>
  );
};

export default Avatar;

import type React from "react";

interface AvatarProps {
  username: string;
  x: number;
  y: number;
}

const Avatar: React.FC<AvatarProps> = ({ username, x, y }) => {
  return (
    <div
      className="avatar"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="avatar-body"></div>
      <div className="avatar-name">{username}</div>
    </div>
  );
};

export default Avatar;

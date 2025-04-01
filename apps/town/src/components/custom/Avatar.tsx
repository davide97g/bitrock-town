import type React from "react";
import { ReactNode } from "react";

interface AvatarProps {
  username: string;
  x: number;
  y: number;
  children?: ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({ username, x, y, children }) => {
  return (
    <div
      className="avatar"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {children === undefined && username}
      {children}
    </div>
  );
};

export default Avatar;

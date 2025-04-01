import { useEffect, useState } from "react";

export default function ThinkingLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
      <div className="h-4 w-4 rounded-full bg-muted-foreground/30"></div>
      <span>Thinking{dots}</span>
    </div>
  );
}

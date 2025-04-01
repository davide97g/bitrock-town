import { ReactNode, useEffect, useState } from "react";
import { Loader } from "./Loader";

const { VITE_SERVER_URL } = import.meta.env;

export function ServerReady({ children }: { children: ReactNode }) {
  const [serverReady, setServerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(VITE_SERVER_URL)
      .then(() => setServerReady(true))
      .catch(() => setServerReady(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !serverReady) {
    return (
      <div
        className={`flex justify-center items-center h-screen w-screen bg-gray-800`}
      >
        {isLoading && <Loader />}
        {!isLoading && !serverReady && (
          <div className="text-white text-2xl">Server is not ready</div>
        )}
      </div>
    );
  }
  return children;
}

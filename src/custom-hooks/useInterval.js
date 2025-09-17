"use client";
import React from "react";

export default function useInterval() {
  const intervalRef = React.useRef(null);

  const set = React.useCallback((callback, delay) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(callback, delay);
  }, []);

  const clear = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => clear();
  }, [clear]);

  return { setInterval: set, clearInterval: clear };
}

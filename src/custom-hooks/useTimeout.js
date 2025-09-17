"use client";
import React from "react";

export default function useTimeout() {
  const timeoutRef = React.useRef(null);

  const set = React.useCallback((callback, delay) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, []);

  const clear = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => clear();
  }, [clear]);

  return { setTimeout: set, clearTimeout: clear };
}

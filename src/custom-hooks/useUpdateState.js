import React from "react";

export default function useUpdateState(initialState) {
  const [state, setState] = React.useState(initialState);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  const updateState = React.useCallback((updates) => {
    if (isMountedRef.current) {
      if (typeof updates === "function") {
        setState(updates);
      } else {
        setState((prev) => {
          const result = { ...prev };

          for (const key in updates) {
            const prevVal = prev[key];
            const newVal = updates[key];

            // Object check
            if (
              typeof prevVal === "object" &&
              prevVal !== null &&
              typeof newVal === "object" &&
              newVal !== null &&
              !Array.isArray(prevVal) &&
              !Array.isArray(newVal)
            ) {
              result[key] = { ...prevVal, ...newVal };
            }
            // Array check
            else if (Array.isArray(prevVal) && Array.isArray(newVal)) {
              result[key] = [...newVal];
            }
            // If not array or object
            else {
              result[key] = newVal;
            }
          }
          return result;
        });
      }
    }
  }, []);

  return [state, updateState, setState];
}

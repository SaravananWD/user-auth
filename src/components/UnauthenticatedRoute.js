"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Overlay, Spinner } from "./MiniStyleComponents";
import useTimeout from "@/custom-hooks/useTimeout";
import PropTypes from "prop-types";

function UnauthenticatedRoute({
  children,
  skipRedirect,
  redirectPath = "/dashboard",
}) {
  const router = useRouter();
  const [redirecting, setRedirecting] = React.useState(false);
  const { setTimeout: setTimeoutSafe } = useTimeout();

  React.useEffect(() => {
    // skip redirect if login page is showing its own overlay
    if (skipRedirect) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !skipRedirect) {
        setRedirecting(true);
        setTimeoutSafe(() => {
          router.replace(redirectPath);
        }, 1500);
      }
    });

    return unsubscribe;
  }, [redirectPath, skipRedirect, router, setTimeoutSafe]);

  return (
    <>
      {redirecting && !skipRedirect && (
        <Overlay>
          <span className="overlayBlock">
            <span className="overlayIcon">
              <Spinner />
            </span>
            <span>Already logged in. Redirecting to your dashboard...</span>
          </span>
        </Overlay>
      )}
      {children}
    </>
  );
}

UnauthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  skipRedirect: PropTypes.bool,
  redirectPath: PropTypes.string,
};

export default UnauthenticatedRoute;

"use client";
import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Overlay, Spinner } from "@/components/MiniStyleComponents";

export default function ProtectedRoute({ children }) {
  const { user, loadingAuth, isIntentionalLogout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loadingAuth && user === null && !isIntentionalLogout) {
      router.push("/login");
    }
  }, [user, router, isIntentionalLogout, loadingAuth]);

  if (loadingAuth) {
    return (
      <Overlay>
        <span className="overlayBlock">
          <span className="overlayIcon">
            <Spinner />
          </span>
          <span>Loading...</span>
        </span>
      </Overlay>
    );
  }

  if (user === null && !isIntentionalLogout) {
    return (
      <Overlay>
        <span className="overlayBlock">
          <span className="overlayIcon">
            <Spinner />
          </span>
          <span>Redirecting to login...</span>
        </span>
      </Overlay>
    );
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

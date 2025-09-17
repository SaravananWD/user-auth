"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { applyActionCode } from "firebase/auth";

import { Prompt, Spinner } from "@/components/MiniStyleComponents";
import {
  MailCheck as MailCheckIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getVerifyEmailErrorMessage } from "@/utils/getErrorMessage";
import useUpdateState from "@/custom-hooks/useUpdateState";
import useTimeout from "@/custom-hooks/useTimeout";
import PropTypes from "prop-types";

function VerifyEmail({ oobCode }) {
  const initialState = {
    loading: true,
    success: false,
    error: null,
  };
  const [state, updateState] = useUpdateState(initialState);
  const router = useRouter();
  const { setTimeout: setTimeoutSafe } = useTimeout();

  const hasRun = React.useRef(false);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;

    if (hasRun.current) return;
    hasRun.current = true;

    async function handleAction() {
      try {
        await applyActionCode(auth, oobCode);
        if (isMountedRef.current) {
          updateState({
            success: true,
            error: null,
            loading: false,
          });
        }
        setTimeoutSafe(() => {
          if (isMountedRef.current) {
            const currentUser = auth.currentUser;
            if (currentUser) {
              router.push("/dashboard");
            } else {
              router.push("/login");
            }
          }
        }, 3000);
      } catch (err) {
        if (isMountedRef.current) {
          const errorMessage = getVerifyEmailErrorMessage(err);
          updateState({ error: errorMessage, loading: false });
        }
      }
    }
    handleAction();

    return () => {
      isMountedRef.current = false;
    };
  }, [oobCode, router, updateState, setTimeoutSafe]);

  if (state.loading) {
    return <LoadingPrompt />;
  }

  if (state.error) {
    return <ErrorPrompt error={state.error} />;
  }

  if (state.success) {
    return <SuccessPrompt />;
  }
}
VerifyEmail.propTypes = {
  oobCode: PropTypes.string.isRequired,
};

export default VerifyEmail;

const ErrorPrompt = ({ error }) => (
  <Prompt>
    <div className="iconContainer">
      <TriangleAlertIcon color="var(--color-accent)" />
    </div>
    <p className="text">{error}</p>
  </Prompt>
);

ErrorPrompt.propTypes = {
  error: PropTypes.string.isRequired,
};

const LoadingPrompt = () => (
  <Prompt>
    <div className="iconContainer">
      <Spinner $color="var(--color-text)" />
    </div>
    <p className="text">Verifying your email...</p>
  </Prompt>
);

const SuccessPrompt = () => {
  // fetch directly
  const currentUser = auth.currentUser;
  const email = currentUser?.email;

  return (
    <Prompt>
      <div className="iconContainer">
        <MailCheckIcon color="var(--color-secondary)" />
      </div>
      <p>
        Thanks for verifying your email
        {email && (
          <>
            {" "}
            <strong>{email}</strong>
          </>
        )}
        .
      </p>
      <p className="text">
        Redirecting you to{" "}
        {currentUser ? (
          <Link href="/dashboard">Dashboard</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
        .
      </p>
    </Prompt>
  );
};

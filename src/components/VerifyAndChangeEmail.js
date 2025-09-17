"use client";
import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import { checkActionCode, applyActionCode, signOut } from "firebase/auth";

import { Prompt, Spinner } from "@/components/MiniStyleComponents";
import {
  MailCheck as MailCheckIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getVerifyAndChangeEmailErrorMessage } from "@/utils/getErrorMessage";
import useUpdateState from "@/custom-hooks/useUpdateState";
import useTimeout from "@/custom-hooks/useTimeout";

function VerifyAndChangeEmail({ oobCode }) {
  const initialState = {
    loading: true,
    success: false,
    error: null,
    email: undefined,
  };
  const [state, updateState] = useUpdateState(initialState);
  const hasRun = React.useRef(false);
  const { setTimeout: setTimeoutSafe } = useTimeout();

  React.useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleAction() {
      try {
        const actionInfo = await checkActionCode(auth, oobCode);
        await applyActionCode(auth, oobCode);

        updateState({
          success: true,
          loading: false,
          error: null,
          email: actionInfo.data.email,
        });

        // Sign the user out to force re-login with the new email
        setTimeoutSafe(() => {
          signOut(auth).catch((err) => {
            console.log("Failed to sign out after email verification:", err);
          });
        }, 1000);
      } catch (err) {
        const errorMessage = getVerifyAndChangeEmailErrorMessage(err);
        updateState({ error: errorMessage, loading: false });
      }
    }
    handleAction();
  }, [oobCode, updateState]);

  if (state.loading) {
    return <LoadingPrompt />;
  }

  if (state.error) {
    return <ErrorPrompt error={state.error} />;
  }

  if (state.success) {
    return <SuccessPrompt email={state.email} />;
  }
  return null;
}
VerifyAndChangeEmail.propTypes = {
  oobCode: PropTypes.string.isRequired,
};

export default VerifyAndChangeEmail;

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

const SuccessPrompt = ({ email }) => (
  <Prompt>
    <div className="iconContainer">
      <MailCheckIcon color="var(--color-secondary)" />
    </div>
    <p>
      Thanks for verifying your new email, <strong>{email}</strong>.
    </p>
    <p className="text">
      You&#39;ll be signed out shortly. Please <Link href="/login">login</Link>{" "}
      again using your updated email.
    </p>
  </Prompt>
);

SuccessPrompt.propTypes = {
  email: PropTypes.string.isRequired,
};

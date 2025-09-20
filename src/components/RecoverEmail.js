"use client";
import React from "react";
import Link from "next/link";

import { auth } from "@/lib/firebase";
import {
  applyActionCode,
  checkActionCode,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  RotateCcw as RotateCcwIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-react";
import { Prompt, Spinner } from "@/components/MiniStyleComponents";

import { getRecoverEmailErrorMessage } from "@/utils/getErrorMessage";
import useUpdateState from "@/custom-hooks/useUpdateState";
import PropTypes from "prop-types";

function RecoverEmail({ oobCode }) {
  const initialState = {
    loading: true,
    success: false,
    recoverEmailError: null,
    passwordResetError: null,
    restoredEmail: null,
  };
  const [state, updateState] = useUpdateState(initialState);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleAction() {
      try {
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        const email = actionCodeInfo.data.email;
        updateState({ restoredEmail: email });

        // revert to old email
        await applyActionCode(auth, oobCode);

        try {
          // send password reset email
          await sendPasswordResetEmail(auth, email);
        } catch (err) {
          console.log(err.code);
          updateState({
            passwordResetError:
              "We restored your email, but couldn’t send a password reset link. Please reset it manually from the login page.",
          });
        }

        updateState({
          success: true,
          loading: false,
        });

        // Sign the user out to force re-login with the recovered email
        signOut(auth).catch((err) => {
          console.log("Failed to sign out after email recovery:", err);
        });
      } catch (err) {
        console.log("Recover Email Error: ", err.code);
        const errorMessage = getRecoverEmailErrorMessage(err);
        updateState({ recoverEmailError: errorMessage, loading: false });
      }
    }
    handleAction();
  }, [oobCode, updateState]);

  if (state.loading) {
    return <LoadingPrompt />;
  }

  if (state.success) {
    return (
      <SuccessPrompt
        restoredEmail={state.restoredEmail}
        passwordResetError={state.passwordResetError}
      />
    );
  }

  if (state.recoverEmailError) {
    return <ErrorPrompt recoverEmailError={state.recoverEmailError} />;
  }
  return null;
}

RecoverEmail.propTypes = {
  oobCode: PropTypes.string.isRequired,
};

export default RecoverEmail;

const LoadingPrompt = () => {
  return (
    <Prompt>
      <div className="iconContainer">
        <Spinner $color="var(--color-text)" />
      </div>
      <p className="text">Restoring your email address...</p>
    </Prompt>
  );
};

const SuccessPrompt = ({ passwordResetError, restoredEmail }) => {
  return (
    <Prompt>
      <div className="iconContainer">
        <RotateCcwIcon color="var(--color-secondary)" />
      </div>
      <p>
        Your email has been restored to <strong>{restoredEmail}</strong>. You
        can now <Link href="/login">log in</Link> with this address.
      </p>
      {passwordResetError ? (
        <>
          <div className="iconContainer">
            <TriangleAlertIcon color="var(--color-accent)" />
          </div>
          <p className="text">{passwordResetError}</p>
        </>
      ) : (
        <p className="text">
          For your security, we&rsquo;ve also sent a password reset link. Please
          reset your password to keep your account safe.
        </p>
      )}
    </Prompt>
  );
};

SuccessPrompt.propTypes = {
  passwordResetError: PropTypes.string,
  restoredEmail: PropTypes.string.isRequired,
};

const ErrorPrompt = ({ recoverEmailError }) => {
  return (
    <Prompt>
      <div className="iconContainer">
        <TriangleAlertIcon color="var(--color-accent)" />
      </div>
      <p className="text">{recoverEmailError}</p>
    </Prompt>
  );
};

ErrorPrompt.propTypes = {
  recoverEmailError: PropTypes.string.isRequired,
};

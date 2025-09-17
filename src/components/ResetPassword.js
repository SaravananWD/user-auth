"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  AuthButton,
  FormWrapper,
  Prompt,
  Spinner,
  Error,
  Overlay,
} from "@/components/MiniStyleComponents";
import { TriangleAlert as TriangleAlertIcon } from "lucide-react";

import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getResetPasswordErrorMessage } from "@/utils/getErrorMessage";
import { validatePassword } from "@/utils/validateFormFields";
import useTimeout from "@/custom-hooks/useTimeout";
import useUpdateState from "@/custom-hooks/useUpdateState";
import PropTypes from "prop-types";

function ResetPassword({ oobCode }) {
  const initialState = {
    loading: true,
    submitting: false,
    verified: false,
    passwordUpdated: false,
    error: null,
    formError: null,
  };
  const [state, updateState] = useUpdateState(initialState);

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { setTimeout: setRedirectTimer } = useTimeout();
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;
    async function verifyAuth() {
      try {
        updateState({ loading: true });
        await verifyPasswordResetCode(auth, oobCode);
        isMounted && updateState({ verified: true });
      } catch (err) {
        if (isMounted) {
          const errorMessage = getResetPasswordErrorMessage(err);
          updateState({ error: errorMessage });
        }
      } finally {
        isMounted && updateState({ loading: false });
      }
    }
    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [oobCode, updateState]);

  async function handleReset(e) {
    e.preventDefault();
    updateState({ submitting: true, formError: null });

    const passErrorText = validatePassword(newPassword, confirmPassword);
    if (passErrorText) {
      updateState({ formError: passErrorText, submitting: false });
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      updateState({ passwordUpdated: true });
      signOut(auth).finally(() => {
        setRedirectTimer(() => {
          router.push("/login");
        }, 1500);
      });
    } catch (err) {
      const errorMessage = getResetPasswordErrorMessage(err);
      updateState({ formError: errorMessage, submitting: false });
    } finally {
      updateState({ submitting: false });
    }
  }

  if (state.loading) {
    return <VerifyingPrompt />;
  }

  if (state.error) {
    return <ErrorPrompt error={state.error} />;
  }

  return (
    <>
      {state.passwordUpdated && <SuccessOverlay />}

      <p>Please enter your new password below:</p>
      {/* className="mb2" */}
      <FormWrapper>
        <form onSubmit={handleReset}>
          <div className="auth-form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              required
              disabled={state.submitting}
              type="password"
              autoComplete="new-password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              required
              disabled={state.submitting}
              type="password"
              autoComplete="new-password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {state.formError && <Error>{state.formError}</Error>}
          <AuthButton disabled={state.submitting}>
            {state.submitting ? "Saving new password..." : "Save Password"}
          </AuthButton>
        </form>
      </FormWrapper>
    </>
  );
}

ResetPassword.propTypes = {
  oobCode: PropTypes.string.isRequired,
};

export default ResetPassword;

const VerifyingPrompt = () => {
  return (
    <Prompt>
      <div className="iconContainer">
        <Spinner $color="var(--color-text)" />
      </div>
      <p className="text">Verifying reset link...</p>
    </Prompt>
  );
};

const ErrorPrompt = ({ error }) => {
  return (
    <Prompt>
      <div className="iconContainer">
        <TriangleAlertIcon color="var(--color-accent)" />
      </div>
      <p className="text">
        {error || "Something went wrong. Try again or contact support."}
      </p>
    </Prompt>
  );
};

ErrorPrompt.propTypes = {
  error: PropTypes.string,
};

const SuccessOverlay = () => {
  return (
    <Overlay>
      <div>
        <span className="overlayBlock">
          <span className="overlayIcon">
            <Spinner />
          </span>
          <span className="overlayText">
            Password updated! Redirecting you to login...
          </span>{" "}
        </span>
      </div>
    </Overlay>
  );
};

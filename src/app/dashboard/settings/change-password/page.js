"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  Overlay,
  FormWrapper,
  AuthButton,
  Error,
  Spinner,
} from "@/components/MiniStyleComponents";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPasswordChangeErrorMessage } from "@/utils/getErrorMessage";
import useTimeout from "@/custom-hooks/useTimeout";
import { validatePassword } from "@/utils/validateFormFields";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function ChangePassword() {
  const router = useRouter();

  const [state, setState] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    submitting: false,
    success: false,
    error: null,
  });

  const { setTimeout: setRedirectTimer } = useTimeout();

  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateState = (updates) => {
    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, ...updates }));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // fetch currentuser from firebase
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      updateState({ error: "Authentication required. Please log in again." });
      return;
    }

    if (state.currentPassword === state.newPassword) {
      updateState({
        error: "New password cannot be the same as the current password.",
      });
      return;
    }

    const passError = validatePassword(
      state.newPassword,
      state.confirmPassword
    );
    if (passError) {
      updateState({ error: passError });
      return;
    }

    updateState({ submitting: true, error: null });

    try {
      // reauthenticate
      const cred = EmailAuthProvider.credential(
        currentUser.email,
        state.currentPassword
      );
      await reauthenticateWithCredential(currentUser, cred);

      await updatePassword(currentUser, state.newPassword);

      updateState({
        success: true,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setRedirectTimer(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const errorMessage = getPasswordChangeErrorMessage(err);
      console.error(err);

      updateState({ error: errorMessage });
    } finally {
      updateState({ submitting: false });
    }
  }

  return (
    <>
      <ProtectedRoute>
        <AuthProtoHeader>Change Password</AuthProtoHeader>
        {state.success && (
          <Overlay>
            <div>
              <span className="overlayBlock">
                <span className="overlayIcon">
                  <Spinner />
                </span>
                <span className="overlayText">
                  Password updated! Redirecting to your dashboard...
                </span>
              </span>
            </div>
          </Overlay>
        )}
        <FormWrapper>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                required
                disabled={state.submitting}
                autoComplete="current-password"
                type="password"
                id="currentPassword"
                value={state.currentPassword}
                onChange={(e) =>
                  updateState({
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                required
                disabled={state.submitting}
                autoComplete="new-password"
                type="password"
                id="newPassword"
                value={state.newPassword}
                onChange={(e) => updateState({ newPassword: e.target.value })}
              />
            </div>{" "}
            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                required
                disabled={state.submitting}
                type="password"
                autoComplete="new-password"
                id="confirmPassword"
                value={state.confirmPassword}
                onChange={(e) =>
                  updateState({ confirmPassword: e.target.value })
                }
              />
            </div>
            {state.error && <Error>{state.error}</Error>}
            <AuthButton disabled={state.submitting}>
              {state.submitting ? "Changing password..." : "Change Password"}
            </AuthButton>
          </form>
        </FormWrapper>
      </ProtectedRoute>
    </>
  );
}

export default ChangePassword;

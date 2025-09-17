"use client";
import React from "react";
import Link from "next/link";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import {
  FormWrapper,
  AuthButton,
  Error,
  Prompt,
} from "@/components/MiniStyleComponents";
import { Send as SendIcon } from "lucide-react";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getEmailUpdateErrorMessage } from "@/utils/getErrorMessage";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function UpdateEmail() {
  const { user } = useAuth();

  const [state, setState] = React.useState({
    currentPassword: "",
    newEmail: "",
    submitting: false,
    success: false,
    error: null,
  });

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

    updateState({ submitting: true, error: null });

    if (currentUser?.email === state.newEmail) {
      updateState({
        error:
          "New email is same as current email. Please check and try again.",
        submitting: false,
      });
      return;
    }

    try {
      // reauthenticate
      const cred = EmailAuthProvider.credential(
        currentUser.email,
        state.currentPassword
      );
      await reauthenticateWithCredential(currentUser, cred);

      // update email
      await verifyBeforeUpdateEmail(currentUser, state.newEmail);
      updateState({ success: true });
    } catch (err) {
      const errorMessage = getEmailUpdateErrorMessage(err);
      updateState({ error: errorMessage });
    } finally {
      updateState({ submitting: false });
    }
  }

  return (
    <ProtectedRoute>
      <AuthProtoHeader>Update Email</AuthProtoHeader>
      {state.success ? (
        <Prompt>
          <div className="iconContainer">
            <SendIcon />
          </div>
          <p className="text">
            We sent a verification link to <strong>{state.newEmail}</strong>.
            Please check your inbox (and spam folder) and click the link to
            finish updating your email.{" "}
            <Link href="/dashboard/">Return to dashboard</Link>
          </p>
        </Prompt>
      ) : (
        <FormWrapper>
          <p>
            Current email:
            <br />
            <span style={{ fontWeight: "bold" }}>{user?.email || ""}</span>
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">New Email:</label>
            <input
              required
              disabled={state.submitting}
              autoComplete="email"
              type="email"
              id="email"
              value={state.newEmail}
              onChange={(e) => updateState({ newEmail: e.target.value })}
            />
            <label htmlFor="password">Enter Password:</label>

            <input
              required
              disabled={state.submitting}
              autoComplete="current-password"
              type="password"
              id="password"
              value={state.currentPassword}
              onChange={(e) => updateState({ currentPassword: e.target.value })}
            />

            {state.error && <Error>{state.error}</Error>}
            <AuthButton disabled={state.submitting}>
              {state.submitting ? "Updating email..." : "Update Email"}
            </AuthButton>
          </form>
        </FormWrapper>
      )}
    </ProtectedRoute>
  );
}

export default UpdateEmail;

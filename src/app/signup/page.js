"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { sendEmailVerification, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import {
  Overlay,
  FormWrapper,
  Spinner,
  AuthButton,
  Error,
} from "@/components/MiniStyleComponents";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { getSignupErrorMessage } from "@/utils/getErrorMessage";
import { validateName, validatePassword } from "@/utils/validateFormFields";
import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
import useTimeout from "@/custom-hooks/useTimeout";
import useUpdateState from "@/custom-hooks/useUpdateState";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function Signup() {
  const { signup, user, loadingAuth } = useAuth();
  const router = useRouter();
  const { setTimeout: setTimeoutSafe } = useTimeout();
  const [skipUnauthRedirect, setSkipUnauthRedirect] = React.useState(false);
  const initialAuthCheckedRef = React.useRef(false);

  //Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [role, setRole] = React.useState("user");

  const [state, updateState] = useUpdateState({
    error: { name: null, password: null, main: null },
    success: false,
    loading: false,
  });

  React.useEffect(() => {
    if (!loadingAuth && !initialAuthCheckedRef.current) {
      initialAuthCheckedRef.current = true;
      if (user) {
        setSkipUnauthRedirect(false);
      } else {
        setSkipUnauthRedirect(true);
      }
    }
  }, [loadingAuth, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (state.loading) return;

    updateState({
      loading: true,
      error: { name: null, password: null, main: null },
    });

    const nameErrorText = validateName(name);
    if (nameErrorText) {
      updateState({
        loading: false,
        error: { name: nameErrorText },
      });
      return;
    }

    const passErrorText = validatePassword(password, confirmPassword);
    if (passErrorText) {
      updateState({
        loading: false,
        error: { password: passErrorText },
      });
      return;
    }

    try {
      // create user
      const userCredential = await signup(email, password);

      // update name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // update role - firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await sendEmailVerification(userCredential.user);

      updateState({
        success: true,
        loading: false,
      });
      setTimeoutSafe(() => {
        router.replace("/dashboard");
      }, 1000);
    } catch (err) {
      // get custom error message from error code
      const errorMessage = getSignupErrorMessage(err);
      updateState({
        error: { main: errorMessage },
        loading: false,
      });
    }
  }

  return (
    <UnauthenticatedRoute skipRedirect={skipUnauthRedirect}>
      <AuthProtoHeader>Sign Up</AuthProtoHeader>

      {state.success && <SuccessOverlay />}

      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          {state.error.name && <Error>{state.error.name}</Error>}
          <input
            disabled={state.loading}
            required
            autoComplete="name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email address (verification required)</label>
          <input
            disabled={state.loading}
            required
            autoComplete="email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          {state.error.password && <Error>{state.error.password}</Error>}
          <input
            disabled={state.loading}
            required
            autoComplete="new-password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            disabled={state.loading}
            required
            autoComplete="new-password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="role">Role</label>
          <select
            disabled={state.loading}
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User (default)</option>
            <option value="admin">Admin</option>
          </select>
          {state.error.main && <Error>{state.error.main}</Error>}
          <AuthButton disabled={state.loading}>
            {state.loading ? "Signing up..." : "Sign up"}
          </AuthButton>
        </form>{" "}
        <p>
          Already have an account? <Link href="login">Log in here</Link>.
        </p>
      </FormWrapper>
    </UnauthenticatedRoute>
  );
}

export default Signup;

const SuccessOverlay = () => {
  return (
    <Overlay>
      <div>
        <span className="overlayBlock">
          <span className="overlayIcon">
            <Spinner />
          </span>
          <span className="overlayText">
            Signing you up... Preparing your dashboard.
          </span>
        </span>
      </div>
    </Overlay>
  );
};

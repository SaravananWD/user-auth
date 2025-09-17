"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

import { sendPasswordResetEmail } from "firebase/auth";
import { Send as SendIcon } from "lucide-react";

import {
  Overlay,
  FormWrapper,
  Spinner,
  AuthButton,
  LinkButton,
  Error,
  Prompt,
} from "@/components/MiniStyleComponents";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
import useUpdateState from "@/custom-hooks/useUpdateState";
import useTimeout from "@/custom-hooks/useTimeout";
import {
  getLoginErrorMessage,
  getPasswordResetErrorMessage,
} from "@/utils/getErrorMessage";

import AuthProtoHeader from "@/components/AuthProtoHeader";

function Login() {
  const { login, user, loadingAuth } = useAuth();
  const router = useRouter();

  const initialState = {
    loading: false,
    success: false,
    error: null,
    showLoginFields: true,
    resetSent: false,
  };
  const [state, updateState] = useUpdateState(initialState);
  const { setTimeout: setTimeoutSafe } = useTimeout();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [skipUnauthRedirect, setSkipUnauthRedirect] = React.useState(true);

  const initialAuthCheckedRef = React.useRef(false);

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
    updateState({ loading: true, error: null });

    try {
      await login(email, password);
      updateState({ success: true, loading: false });

      setTimeoutSafe(() => {
        router.replace("/dashboard");
      }, 1000);
    } catch (err) {
      const errorMessage = getLoginErrorMessage(err);
      updateState({ error: errorMessage, loading: false });
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      updateState({ error: "Please enter your email." });
      return;
    }
    updateState({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);

      setTimeoutSafe(() => {
        updateState({ resetSent: true, loading: false, error: null });
      }, 1500);
    } catch (err) {
      const errorMessage = getPasswordResetErrorMessage(err);
      updateState({ error: errorMessage, loading: false });
    }
  }

  function showPasswordResetView() {
    updateState({ showLoginFields: false, error: null });
  }

  function handleBackToLogin() {
    updateState({
      loading: false,
      success: false,
      error: null,
      showLoginFields: true,
      resetSent: false,
    });
  }

  return (
    <UnauthenticatedRoute skipRedirect={skipUnauthRedirect}>
      <>
        <AuthProtoHeader>
          {state.showLoginFields ? "Login" : "Reset Password"}
        </AuthProtoHeader>

        {state.success && <SuccessOverlay />}

        {state.resetSent ? (
          <PasswordResetPrompt email={email} />
        ) : (
          <FormWrapper>
            <form onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label htmlFor="email">Email address</label>
                <input
                  disabled={state.loading}
                  autoComplete="email"
                  required
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {state.showLoginFields && (
                <div className="auth-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    required
                    disabled={state.loading}
                    autoComplete="current-password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              {state.error && <Error>{state.error}</Error>}
              {state.showLoginFields ? (
                <AuthButton type="submit" disabled={state.loading}>
                  {state.loading ? "Logging in..." : "Log in"}
                </AuthButton>
              ) : (
                <AuthButton
                  disabled={state.loading}
                  onClick={handlePasswordReset}
                >
                  {state.loading ? "Sending..." : "Send reset link"}
                </AuthButton>
              )}
            </form>

            {state.showLoginFields ? (
              <>
                <LinkButton onClick={showPasswordResetView}>
                  Forgot your password?
                </LinkButton>
                <p>
                  Don&rsquo;t have an account?{" "}
                  <Link href="signup">Sign up here</Link>.
                </p>
              </>
            ) : (
              <>
                <p className="">
                  Remember your password?{" "}
                  <Link href="#" onClick={handleBackToLogin}>
                    Back to Login
                  </Link>
                  .
                </p>
              </>
            )}
          </FormWrapper>
        )}
      </>
    </UnauthenticatedRoute>
  );
}

export default Login;

const SuccessOverlay = () => {
  return (
    <Overlay>
      <div>
        <span className="overlayBlock">
          <span className="overlayIcon">
            <Spinner />
          </span>
          <span className="overlayText">
            Login successful! Redirecting to dashboard...
          </span>
        </span>
      </div>
    </Overlay>
  );
};
// eslint-disable-next-line react/prop-types
const PasswordResetPrompt = ({ email }) => {
  return (
    <Prompt>
      <div className="iconContainer">
        <SendIcon />
      </div>
      <p className="text">
        If an account exists for <strong>{email}</strong>, you will receive a
        password reset link! Check your inbox (and spam folder) to continue.
      </p>
    </Prompt>
  );
};

PasswordResetPrompt.propTypes = {
  email: PropTypes.string.isRequired,
};

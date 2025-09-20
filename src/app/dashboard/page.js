"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

import space from "@/utils/space";
import { device } from "@/styles/breakpoints";
import {
  Overlay,
  Prompt,
  Spinner,
  Alert,
  Error,
  IconWrapper,
} from "@/components/MiniStyleComponents";
import DemoButton from "@/components/DemoButton";
import {
  UserStar as UserStarIcon,
  UserRound as UserRoundIcon,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import useInterval from "@/custom-hooks/useInterval";
import useTimeout from "@/custom-hooks/useTimeout";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function DashboardApp() {
  const { user, logout, reload, loadingAuth, sendEmail } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const [mailSent, setMailSent] = React.useState(false);
  const [mailCount, setMailCount] = React.useState(0);
  const [mailError, setMailError] = React.useState(null);
  const [mailLoading, setMailLoading] = React.useState(false);

  const router = useRouter();
  const { setTimeout: setTimeoutSafe } = useTimeout();
  const { setInterval: setIntervalSafe, clearInterval: clearIntervalSafe } =
    useInterval();

  React.useEffect(() => {
    if (!user || loadingAuth || user?.emailVerified) return;

    const refreshEmailStatus = async () => {
      if (user?.emailVerified) return;
      try {
        await reload();
      } catch (err) {
        console.error("Failed to refresh email status", err);
      }
    };
    refreshEmailStatus();

    const handleFocus = () => {
      refreshEmailStatus();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleLogout = React.useCallback(async () => {
    setIsLoggingOut(true);
    setTimeoutSafe(async () => {
      try {
        await logout();
        router.push("/login");
      } catch (err) {
        console.error(err.message);
      }
    }, 1500);
  }, [setTimeoutSafe, logout, router]);

  const resendVerificationEmail = React.useCallback(async () => {
    try {
      setMailLoading(true);
      await sendEmail();
      setMailSent(true);
      let i = 30;
      setMailCount(i);
      setIntervalSafe(() => {
        i--;
        setMailCount(i);
        if (i <= 0) {
          clearIntervalSafe();
          setMailSent(false);
        }
      }, 1000);
    } catch (err) {
      setMailError("Something went wrong. Try again later.", err);
    } finally {
      setMailLoading(false);
    }
  }, [sendEmail]);

  const emailVerificationAlertValues = {
    user,
    mailSent,
    mailCount,
    mailError,
    resendVerificationEmail,
    mailLoading,
  };

  return (
    <>
      {isLoggingOut && <LogoutOverlay />}

      <ProtectedRoute>
        <AuthProtoHeader>Dashboard</AuthProtoHeader>
        <EmailVerificationAlert {...emailVerificationAlertValues} />
        {loadingAuth ? (
          <LoadingPrompt />
        ) : (
          <DashBoardWrapper>
            <div className="body">
              <h3>
                Welcome, <AuthUsername>{user?.name}</AuthUsername>!
              </h3>
              <p>You&rsquo;re an authorized user of this demo prototype.</p>
              <p>
                In a real project, this is where member-only content would
                appear. As a registered user, you can now:
              </p>
              <ul>
                <li>
                  <Link href="/dashboard/settings/edit-profile">
                    Edit your profile
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings/change-password">
                    Change your password
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings/update-email">
                    Update your email
                  </Link>
                </li>{" "}
              </ul>
              <DemoButton onClick={handleLogout}>Log out</DemoButton>
            </div>

            {user?.role === "admin" ? (
              <AdminContent>
                <div>
                  <h5>
                    Role: Admin <br />
                    Status: {user?.emailVerified ? "Verified" : "Unverified"}
                  </h5>

                  <UserStar>
                    <UserStarIcon size={space(15)} />
                  </UserStar>

                  <p style={{ marginBottom: 0 }}>
                    The Star User icon above is visible only to you. It shows
                    that you&rsquo;re assigned the Admin role. Since this is
                    just a prototype, you can change your role by editing your
                    profile to test it out.
                  </p>
                </div>
              </AdminContent>
            ) : (
              user?.role === "user" && (
                <AdminContent>
                  <div>
                    <h5>
                      Role: Standard User <br />
                      Status: {user?.emailVerified ? "Verified" : "Unverified"}
                    </h5>

                    <UserRound>
                      <UserRoundIcon size={space(15)} />
                    </UserRound>

                    <p style={{ marginBottom: 0 }}>
                      The icon above shows your current role. Since this is a
                      prototype, you can edit your profile to change roles and
                      test it out.
                    </p>
                  </div>{" "}
                </AdminContent>
              )
            )}
          </DashBoardWrapper>
        )}
      </ProtectedRoute>
    </>
  );
}

export default DashboardApp;

const LogoutOverlay = () => {
  return (
    <Overlay className="fade-in">
      <span className="overlayBlock">
        <span className="overlayIcon">
          <Spinner />
        </span>
        <span className="overlayText">Logging you out... See you soon!</span>
      </span>
    </Overlay>
  );
};

import PropTypes from "prop-types";

const EmailVerificationAlert = ({
  user,
  mailSent,
  mailCount,
  mailError,
  resendVerificationEmail,
  mailLoading,
}) => {
  return (
    <>
      {user?.emailVerified === false ? (
        mailSent ? (
          <Alert>
            <span className="auth-mailSent">
              A new verification email has just been sent. If you don&rsquo;t
              see it in your inbox, check your spam folder. You can request
              another in <span className="auth-countdown">({mailCount}s)</span>.
            </span>
          </Alert>
        ) : (
          <Alert>
            <div className="maxWidth">
              We&rsquo;ve sent a verification link to your email. Please check
              your inbox (and spam folder) and click the link to verify your
              account.
            </div>
            {mailError ? (
              <Error>{mailError}</Error>
            ) : (
              <button onClick={resendVerificationEmail}>
                {mailLoading
                  ? "Resending email..."
                  : "Resend Verification Email"}
              </button>
            )}
          </Alert>
        )
      ) : null}
    </>
  );
};

EmailVerificationAlert.propTypes = {
  user: PropTypes.object,
  mailSent: PropTypes.bool.isRequired,
  mailCount: PropTypes.number.isRequired,
  mailError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  resendVerificationEmail: PropTypes.func.isRequired,
  mailLoading: PropTypes.bool.isRequired,
};

const LoadingPrompt = () => {
  return (
    <Prompt>
      <div className="iconContainer">
        <Spinner $color="var(--color-text)" />
      </div>
      <p className="text">Loading your dashboard...</p>
    </Prompt>
  );
};

// styled-components

const DashBoardWrapper = styled.div`
  text-align: left;
  display: flex;
  gap: ${space(5)}px ${space(3)}px;
  flex-wrap: wrap;

  @media ${device.laptop} {
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  h3 {
    padding-top: 0;
  }
`;

const AuthUsername = styled.span`
  color: var(--color-secondary);
`;

const AdminContent = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-muted);
  padding: ${space(3)}px;
  border-radius: ${space(2)}px;

  @media ${device.laptop} {
    max-width: ${space(75)}px;
  }
`;

const UserStar = styled(IconWrapper)`
  border: 2px solid var(--color-secondary);
  color: var(--color-secondary);
`;

const UserRound = styled(IconWrapper)`
  border: 2px solid var(--color-muted);
  color: var(--color-muted);
`;

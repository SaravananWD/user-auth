"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { TriangleAlert as TriangleAlertIcon } from "lucide-react";
import { Prompt } from "@/components/MiniStyleComponents";

import VerifyAndChangeEmail from "@/components/VerifyAndChangeEmail";
import VerifyEmail from "@/components/VerifyEmail";
import RecoverEmail from "@/components/RecoverEmail";
import ResetPassword from "@/components/ResetPassword";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function VerifyUser() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <VerifyUserInner />
    </React.Suspense>
  );
}

function VerifyUserInner() {
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const title = getTitle(mode);

  function getModeComponent(m) {
    switch (m) {
      case "verifyEmail":
        return <VerifyEmail oobCode={oobCode} />;
      case "verifyAndChangeEmail":
        return <VerifyAndChangeEmail oobCode={oobCode} />;
      case "recoverEmail":
        return <RecoverEmail oobCode={oobCode} />;
      case "resetPassword":
        return <ResetPassword oobCode={oobCode} />;
      default:
        return (
          <Prompt>
            <div className="iconContainer">
              <TriangleAlertIcon color="var(--color-accent)" />
            </div>
            <p className="text">
              Something went wrong. Please try again or contact support.
            </p>
          </Prompt>
        );
    }
  }

  return (
    <>
      <AuthProtoHeader>Verify User</AuthProtoHeader>
      {!mode || !oobCode ? (
        <Prompt>
          <div className="iconContainer">
            <TriangleAlertIcon color="var(--color-accent)" />
          </div>
          <p className="text">
            Something went wrong. Please try again or contact support.
          </p>
        </Prompt>
      ) : null}
      {getModeComponent(mode)}
    </>
  );
}

export default VerifyUser;

function getTitle(mode) {
  switch (mode) {
    case "verifyEmail":
      return "Verify Email";
    case "verifyAndChangeEmail":
      return "Verify New Email";
    case "recoverEmail":
      return "Recover Email";
    case "resetPassword":
      return "Reset Password";
    default:
      return "Verify User";
  }
}

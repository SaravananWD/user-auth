"use client";
import React from "react";
import Link from "next/link";
import { LockKeyhole as LockKeyholeIcon } from "lucide-react";

import DemoButton from "@/components/DemoButton";
import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
import AuthProtoHeader from "@/components/AuthProtoHeader";
import space from "@/utils/space";

function AuthenticationHome() {
  return (
    <UnauthenticatedRoute>
      <AuthProtoHeader />
      <p>Welcome! You need to log in to view this mini site’s content.</p>
      <Link href="/login">
        <DemoButton
          mb="5"
          icon={<LockKeyholeIcon size={space(4)} strokeWidth={2.5} />}
        >
          Login to access
        </DemoButton>
      </Link>
      <p>
        New here? <Link href="/signup">Sign up</Link> to create your account.
      </p>
    </UnauthenticatedRoute>
  );
}
export default AuthenticationHome;

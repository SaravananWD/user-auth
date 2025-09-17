"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getProfileUpdateErrorMessage } from "@/utils/getErrorMessage";
import { validateName } from "@/utils/validateFormFields";
import useTimeout from "@/custom-hooks/useTimeout";

import {
  Overlay,
  FormWrapper,
  Spinner,
  AuthButton,
  Error,
  Prompt,
} from "@/components/MiniStyleComponents";
import AuthProtoHeader from "@/components/AuthProtoHeader";

function EditProfile() {
  const { user, reload, loadingAuth } = useAuth();
  const router = useRouter();
  const { setTimeout: setTimeoutSafe } = useTimeout();

  //Form states
  const [name, setName] = React.useState(user?.name || "");
  const [role, setRole] = React.useState(user?.role || "user");
  const [submitting, setSubmitting] = React.useState(false);

  const [nameError, setNameError] = React.useState(null);
  const [mainError, setMainError] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setRole(user.role || "user");
    }
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    const currentUser = auth.currentUser;
    if (!user || !currentUser) return;

    setSubmitting(true);
    setNameError(null);
    setMainError(null);

    const nameErrorText = validateName(name);
    if (nameErrorText) {
      setNameError(nameErrorText);
      setSubmitting(false);
      return;
    }

    try {
      await updateProfile(currentUser, {
        displayName: name,
      });

      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, { name, role, updatedAt: serverTimestamp() });

      // refresh authcontext
      await reload();
      setIsSuccess(true);

      setTimeoutSafe(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err) {
      const errorMessage = getProfileUpdateErrorMessage(err);
      setMainError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <AuthProtoHeader>Edit Profile</AuthProtoHeader>

      {loadingAuth && <LoadingPrompt />}

      {isSuccess && (
        <Overlay>
          <div>
            <span className="overlayBlock">
              <span className="overlayIcon">
                <Spinner />
              </span>
              <span className="overlayText">
                Profile updated! Opening Dashboard...
              </span>{" "}
            </span>
          </div>
        </Overlay>
      )}

      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          {nameError && <Error>{nameError}</Error>}
          <input
            required
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {mainError && <Error>{mainError}</Error>}
          <AuthButton disabled={submitting}>
            {submitting ? "Saving changes..." : "Save Changes"}
          </AuthButton>
        </form>
      </FormWrapper>
    </ProtectedRoute>
  );
}

export default EditProfile;

const LoadingPrompt = () => {
  return (
    <Prompt>
      <div className="iconContainer">
        <Spinner $color="var(--color-text)" />
      </div>
      <p className="text">Loading...</p>
    </Prompt>
  );
};

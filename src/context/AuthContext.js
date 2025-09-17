"use client";
import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { defaultRole } from "@/utils/constants";
import PropTypes from "prop-types";

const AuthContext = React.createContext();

async function fetchAndMergeUserData(firebaseUser) {
  try {
    const ref = doc(db, "users", firebaseUser.uid);
    let snap = await getDoc(ref);

    // console.log("First attempt - document exists:", snap.exists());

    if (!snap.exists()) {
      // console.log("Document not found, retrying in 500ms...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      snap = await getDoc(ref);

      // console.log("Retry attempt - document exists:", snap.exists());
      if (!snap.exists()) {
        throw new Error(
          "Firestore document does not exist for user. Retry attempt also failed."
        );
      }
    }

    const userData = snap.data();
    return {
      // firebase data
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      // firestore data
      role: userData.role || defaultRole,
      name: userData.name || firebaseUser?.displayName || "User",
      createdAt: userData.createdAt || null,
      updatedAt: userData.updatedAt || null,
    };
  } catch (err) {
    console.error(err);
    return {
      // firebase data
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      // firestore data
      role: defaultRole,
      name: firebaseUser?.displayName || "User",
      createdAt: null,
      updatedAt: null,
    };
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [isIntentionalLogout, setIsIntentionalLogout] = React.useState(false);

  // Check user authentication state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoadingAuth(true);

      if (firebaseUser) {
        setIsIntentionalLogout(false);

        try {
          const mergedUser = await fetchAndMergeUserData(firebaseUser);
          setUser(mergedUser);
        } catch (err) {
          console.error("Failed to fetch user data from Firestore:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Auth functions ~memoized
  const signup = React.useCallback(
    (email, password) => createUserWithEmailAndPassword(auth, email, password),
    []
  );
  const login = React.useCallback(
    (email, password) => signInWithEmailAndPassword(auth, email, password),
    []
  );
  const logout = React.useCallback(() => {
    setIsIntentionalLogout(true);
    signOut(auth);
  }, []);

  const reload = React.useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        const mergedUser = await fetchAndMergeUserData(currentUser);
        setUser(mergedUser);
      }
    } catch (err) {
      console.log("Error on AuthContext Reload attemp", err);
    }
  }, []);

  const sendEmail = React.useCallback(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return sendEmailVerification(currentUser);
    } else {
      return Promise.reject(new Error("No user is currently signed in."));
    }
  }, []);

  const value = {
    user,
    loadingAuth,
    signup,
    login,
    logout,
    reload,
    sendEmail,
    isIntentionalLogout,
    setIsIntentionalLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => React.useContext(AuthContext);
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

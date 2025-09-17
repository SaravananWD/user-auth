export function getSignupErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function getProfileUpdateErrorMessage(error) {
  if (!error?.code) return "Something went wrong. Please try again.";

  switch (error?.code) {
    // Firebase Auth errors
    case "auth/requires-recent-login":
      return "Please log in again to update your profile.";
    case "auth/invalid-user-token":
      return "Your session has expired. Please log in again.";
    case "auth/user-token-expired":
      return "Your session token is no longer valid. Please log in again.";
    case "auth/user-disabled":
      return "Your account has been disabled. Contact support.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/invalid-display-name":
      return "The display name you entered is not valid.";

    // Firestore errors
    case "permission-denied":
      return "You don’t have permission to update this profile.";
    case "unavailable":
      return "The service is temporarily unavailable. Try again later.";
    case "not-found":
      return "Profile data could not be found.";
    case "cancelled":
      return "The update was cancelled. Please try again.";
    default:
      return "Could not update your profile. Please try again.";
  }
}

export function getPasswordChangeErrorMessage(error) {
  switch (error?.code) {
    case "auth/wrong-password":
      return "Your current password is incorrect.";
    case "auth/weak-password":
      return "The new password is too weak. Please choose a stronger one.";
    case "auth/requires-recent-login":
      return "Please log in again to change your password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";
    case "auth/user-not-found":
      return "User account not found.";
    case "auth/invalid-credential":
      return "Invalid login credentials.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function getEmailUpdateErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
      return "Your email or password is incorrect.";
    case "auth/email-already-in-use":
      return "This email is already registered with another account.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/requires-recent-login":
      return "Your session has expired. Please log in again to update your email.";
    case "auth/wrong-password":
      return "Your current password is incorrect.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function getVerifyAndChangeEmailErrorMessage(error) {
  switch (error?.code) {
    case "auth/expired-action-code":
      return "Verification failed. This link may have expired or already been used.";
    case "auth/invalid-credential":
      return "Your email or password is incorrect.";
    case "auth/email-already-in-use":
      return "This email is already registered with another account.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/requires-recent-login":
      return "Your session has expired. Please log in again to update your email.";
    case "auth/wrong-password":
      return "Your current password is incorrect.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";
    case "auth/invalid-action-code":
      return "Action code is invalid. Please try again.";
    case "auth/user-token-expired":
      return "Your session has expired. Please log in again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function getVerifyEmailErrorMessage(error) {
  switch (error?.code) {
    case "auth/expired-action-code":
      return "Verification failed. This link may have expired or already been used.";
    case "auth/invalid-credential":
      return "Your email or password is incorrect.";
    case "auth/requires-recent-login":
      return "Your session has expired. Please log in again to update your email.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";
    case "auth/invalid-action-code":
      return "Action code is invalid. Please try again.";
    case "auth/user-token-expired":
      return "Your session has expired. Please log in again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function getResetPasswordErrorMessage(error) {
  switch (error?.code) {
    case "auth/weak-password":
      return "Password is too weak. Choose a stronger one.";
    case "auth/invalid-action-code":
      return "Reset link is invalid or expired. Please request a new one.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function getRecoverEmailErrorMessage(error) {
  switch (error?.code) {
    case "auth/expired-action-code":
      return "This recovery link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This recovery link is invalid or has already been used.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    case "auth/user-not-found":
      return "No account found for this recovery link.";

    default:
      return "Something went wrong while recovering your email. Please try again later.";
  }
}

export function getLoginErrorMessage(error) {
  switch (error?.code) {
    // Common authentication errors
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "The password is incorrect.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    // Account creation errors
    case "auth/email-already-in-use":
      return "This email address is already in use by another account.";
    case "auth/weak-password":
      return "Password must be at least 6 characters and harder to guess.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Contact support.";
    // Network errors
    case "auth/network-request-failed":
      return "A network error occurred. Please check your connection and try again.";

    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function getPasswordResetErrorMessage(error) {
  switch (error?.code) {
    // Password reset errors
    case "auth/expired-action-code":
      return "The password reset link has expired.";
    case "auth/invalid-action-code":
      return "The password reset link is invalid.";
    case "auth/missing-email":
      return "Please provide an email address.";

    // Network errors
    case "auth/network-request-failed":
      return "A network error occurred. Please check your connection and try again.";

    default:
      return "An unexpected error occurred. Please try again.";
  }
}

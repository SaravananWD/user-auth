export function validatePassword(p1, p2 = p1) {
  if (p1 !== p2) {
    return "Passwords do not match.";
  }
  if (p1.length < 6) {
    return "Password must be at least 6 characters long.";
  }

  return null;
}

export function validateName(n) {
  const trimmedName = n.trim();

  if (!trimmedName) {
    return "Name cannot be empty.";
  }

  if (trimmedName.length < 2 || trimmedName.length > 30) {
    return "Name must be between 2 and 30 characters.";
  }

  const regex = /^[A-Za-z0-9 ]+$/;
  if (!regex.test(trimmedName)) {
    return "Name can only contain letters, numbers, and spaces.";
  }

  return null;
}

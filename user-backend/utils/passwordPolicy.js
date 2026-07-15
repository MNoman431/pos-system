export function validatePasswordPolicy(pwd) {
  const errors = [];
  if (typeof pwd !== "string" || pwd.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(pwd)) errors.push("At least one uppercase letter required");
  if (!/[a-z]/.test(pwd)) errors.push("At least one lowercase letter required");
  if (!/\d/.test(pwd)) errors.push("At least one digit required");
  if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("At least one special character required");
  return errors;
}

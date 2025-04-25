export const isValidEmail = (email: string): boolean => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split("@")[1];

  if (!domain || domain.split(".").length < 2) {
    return false;
  }

  return true;
};

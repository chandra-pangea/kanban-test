export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 6;

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  return errors;
}

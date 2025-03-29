
export const validateRegistrationForm = formData => {
  const {firstName, lastName, phoneNumber, email} = formData;
  const errors = {};


  if (!firstName?.trim()) {
    errors.firstName = 'First name is required';
  }


  if (!lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }


  if (!phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  }


  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
};


export const hasErrors = errors => {
  return Object.values(errors).some(error => error !== '');
};

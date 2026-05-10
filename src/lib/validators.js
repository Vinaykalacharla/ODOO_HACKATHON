function isEmpty(value) {
  return String(value || '').trim().length === 0;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim().toLowerCase());
}

function hasPasswordComplexity(value) {
  const password = String(value || '');
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function validateLogin(values) {
  const errors = {};
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (isEmpty(values.password)) errors.password = 'Password is required.';
  return errors;
}

export function validateSignup(values) {
  const errors = {};
  if (isEmpty(values.name)) errors.name = 'Name is required.';
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!hasPasswordComplexity(values.password)) {
    errors.password = 'Use at least 8 characters with one letter and one number.';
  }
  return errors;
}

export function validateTrip(values) {
  const errors = {};
  if (isEmpty(values.title)) errors.title = 'Trip name is required.';
  if (isEmpty(values.description)) errors.description = 'Add a short description.';
  if (!values.startDate) errors.startDate = 'Start date is required.';
  if (!values.endDate) errors.endDate = 'End date is required.';
  if (values.startDate && values.endDate && new Date(values.endDate) < new Date(values.startDate)) {
    errors.endDate = 'End date must be after the start date.';
  }
  if (values.totalBudget !== '' && Number(values.totalBudget) < 0) {
    errors.totalBudget = 'Budget cannot be negative.';
  }
  return errors;
}

export function validateStop(values) {
  const errors = {};
  if (!values.cityId) errors.cityId = 'Choose a city.';
  if (!values.arrivalDate) errors.arrivalDate = 'Arrival date is required.';
  if (!values.departureDate) errors.departureDate = 'Departure date is required.';
  if (values.arrivalDate && values.departureDate && new Date(values.departureDate) < new Date(values.arrivalDate)) {
    errors.departureDate = 'Departure cannot be before arrival.';
  }
  return errors;
}

export function validateBudgetEntry(values) {
  const errors = {};
  if (isEmpty(values.label)) errors.label = 'Label is required.';
  if (!values.category) errors.category = 'Category is required.';
  if (!values.amount || Number(values.amount) <= 0) errors.amount = 'Enter an amount greater than zero.';
  return errors;
}

export function validatePackingItem(values) {
  const errors = {};
  if (isEmpty(values.label)) errors.label = 'Item name is required.';
  if (!values.category) errors.category = 'Category is required.';
  return errors;
}

export function validateNote(values) {
  const errors = {};
  if (isEmpty(values.content)) errors.content = 'Note content is required.';
  return errors;
}

export function validateProfile(values) {
  const errors = {};
  if (isEmpty(values.name)) errors.name = 'Name is required.';
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  return errors;
}

export function validatePasswordChange(values) {
  const errors = {};
  if (isEmpty(values.currentPassword)) errors.currentPassword = 'Current password is required.';
  if (!hasPasswordComplexity(values.nextPassword)) {
    errors.nextPassword = 'Use at least 8 characters with one letter and one number.';
  }
  if (values.nextPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

export function validateActivityAdd(values) {
  const errors = {};
  if (!values.activityId) errors.activityId = 'Choose an activity.';
  return errors;
}

export function ValidateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const isValid = emailRegex.test(email);
	return isValid;
}

// Utility function to handle Firebase error messages
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const errorCode = (error as any).code;
    const errorMessage = error.message;

    // Firebase error codes
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak (minimum 6 characters)';
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please check your browser settings';
      default:
        return errorMessage || 'An error occurred';
    }
  }
  return 'An unexpected error occurred';
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password strength
export function isStrongPassword(password: string): boolean {
  return password.length >= 6;
}

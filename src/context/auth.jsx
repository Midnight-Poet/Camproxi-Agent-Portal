import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Time in seconds

    // Check if the expiration time (exp) is in the past
    return decoded.exp > currentTime;
  } catch (error) {
    // Return false if decoding fails (malformed token)
    return false;
  }
};
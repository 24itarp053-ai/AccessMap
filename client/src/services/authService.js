import apiClient from './api';

const TOKEN_KEY = 'accessmap_token';

/**
 * Validates registration input fields according to API contract.
 */
export function validateRegisterFields({ name, email, password }) {
  const errors = [];
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim();
  const cleanPassword = String(password || '');

  if (cleanName.length < 2 || cleanName.length > 100) {
    errors.push('Name must be between 2 and 100 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || cleanEmail.length > 255 || !emailRegex.test(cleanEmail)) {
    errors.push('Please enter a valid email address (maximum 255 characters).');
  }

  if (cleanPassword.length < 8 || cleanPassword.length > 128) {
    errors.push('Password must be between 8 and 128 characters.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Register a new user via POST /api/auth/register
 */
export async function registerUser({ name, email, password }) {
  const { isValid, errors } = validateRegisterFields({ name, email, password });
  if (!isValid) {
    return { success: false, error: errors.join(' ') };
  }

  try {
    const response = await apiClient.post('/auth/register', {
      name: name.trim(),
      email: email.trim(),
      password,
    });

    const resData = response.data;
    if (resData && (resData.status === 'success' || resData.data)) {
      const dataPayload = resData.data || resData;
      const token = dataPayload.token;
      const user = dataPayload.user;

      // Validate both token and user presence before storing
      if (token && typeof token === 'string' && user && typeof user === 'object') {
        localStorage.setItem(TOKEN_KEY, token);
        return {
          success: true,
          user,
          token,
          isMock: false,
          message: resData.message || 'Registration successful.',
        };
      }
    }

    return {
      success: false,
      error: resData.message || 'Registration response was missing a valid token or user profile.',
    };
  } catch (error) {
    // If backend returned an HTTP error response (400, 401, 403, 422, 500), return actual error
    if (error.response) {
      const serverMsg = error.response.data?.message || error.response.data?.error || `Registration error (${error.response.status}).`;
      return { success: false, error: serverMsg, isMock: false };
    }

    // Only if network is genuinely offline / unreachable, return explicit error notice
    return {
      success: false,
      error: 'Backend API server unreachable (POST /api/auth/register). Make sure local server is running on http://localhost:5000.',
      isOffline: true,
    };
  }
}

/**
 * Login user via POST /api/auth/login
 */
export async function loginUser({ email, password }) {
  const cleanEmail = String(email || '').trim();
  const cleanPassword = String(password || '');

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Email address and password are required.' };
  }

  try {
    const response = await apiClient.post('/auth/login', {
      email: cleanEmail,
      password: cleanPassword,
    });

    const resData = response.data;
    if (resData && (resData.status === 'success' || resData.data)) {
      const dataPayload = resData.data || resData;
      const token = dataPayload.token;
      const user = dataPayload.user;

      // Validate both non-empty token and user object
      if (token && typeof token === 'string' && user && typeof user === 'object') {
        localStorage.setItem(TOKEN_KEY, token);
        return {
          success: true,
          user,
          token,
          isMock: false,
        };
      }
    }

    return {
      success: false,
      error: resData.message || 'Login response was missing a valid token or user object.',
    };
  } catch (error) {
    // Return HTTP status errors directly (e.g. 401 Invalid Credentials)
    if (error.response) {
      const serverMsg = error.response.status === 401
        ? 'Invalid email or password.'
        : (error.response.data?.message || error.response.data?.error || `Login error (${error.response.status}).`);
      return { success: false, error: serverMsg, isMock: false };
    }

    return {
      success: false,
      error: 'Backend API server unreachable (POST /api/auth/login). Make sure local server is running on http://localhost:5000.',
      isOffline: true,
    };
  }
}

/**
 * Fetch current authenticated user via GET /api/auth/me
 */
export async function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return { success: false, user: null };
  }

  // Never send demo tokens to real GET /auth/me endpoint
  if (token.startsWith('DEMO_TOKEN_') || token.startsWith('demo_token_')) {
    return {
      success: true,
      user: {
        id: 'usr-demo-001',
        name: 'Demo Contributor',
        email: 'demo@accessmap.org',
        role: 'user',
        isMock: true,
      },
    };
  }

  try {
    const response = await apiClient.get('/auth/me');
    const resData = response.data;

    if (resData && (resData.status === 'success' || resData.data)) {
      const user = resData.data?.user || resData.user || resData.data;
      if (user && typeof user === 'object') {
        return {
          success: true,
          user,
          isMock: false,
        };
      }
    }

    // Invalid payload format, clear token
    localStorage.removeItem(TOKEN_KEY);
    return { success: false, user: null };
  } catch (error) {
    // If HTTP 401 (unauthorized / invalid / expired token), clear local token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return { success: false, user: null, isUnauthorized: true };
    }

    // Network error / server offline
    return { success: false, user: null, isOffline: true, error: error.message };
  }
}

/**
 * Log out user by clearing stored accessmap_token
 */
export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
}

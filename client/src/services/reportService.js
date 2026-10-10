import apiClient from './api';

export const REPORT_CATEGORIES = [
  { value: 'wheelchair_access', label: 'Wheelchair Access Issue' },
  { value: 'ramp', label: 'Missing or Damaged Ramp' },
  { value: 'elevator', label: 'Broken Elevator / Lift' },
  { value: 'tactile_paving', label: 'Damaged Tactile Paving' },
  { value: 'accessible_toilet', label: 'Inaccessible Restroom' },
  { value: 'signage', label: 'Missing or Unclear Signage' },
  { value: 'obstacle', label: 'Sidewalk Obstacle / Debris' },
  { value: 'other', label: 'Other Physical Barrier' },
];

/**
 * Validates report submission payload according to backend API specifications.
 */
export function validateReportPayload(payload) {
  const errors = [];

  if (!payload.description || typeof payload.description !== 'string') {
    errors.push('Description is required.');
  } else if (payload.description.trim().length < 10 || payload.description.trim().length > 1000) {
    errors.push('Description must be between 10 and 1000 characters.');
  }

  const validCategories = REPORT_CATEGORIES.map((c) => c.value);
  if (!payload.category || !validCategories.includes(payload.category)) {
    errors.push('Please select a valid barrier category.');
  }

  if (payload.photoUrl && typeof payload.photoUrl === 'string' && payload.photoUrl.trim() !== '') {
    const trimmedUrl = payload.photoUrl.trim();
    if (trimmedUrl.length > 2048) {
      errors.push('Photo URL must not exceed 2048 characters.');
    }
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      errors.push('Photo URL must be a valid HTTP or HTTPS URL.');
    }
  }

  if (payload.location) {
    const { latitude, longitude } = payload.location;
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
      errors.push('Location must contain numeric latitude and longitude values.');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Submit a new barrier report via POST /api/reports
 */
export async function submitReport(reportData) {
  const { isValid, errors } = validateReportPayload(reportData);
  if (!isValid) {
    return { success: false, error: errors.join(' ') };
  }

  // Build backend payload cleanly
  const payload = {
    description: reportData.description.trim(),
    category: reportData.category,
  };

  if (reportData.placeId && String(reportData.placeId).trim()) {
    payload.placeId = String(reportData.placeId).trim();
  }

  if (reportData.location && typeof reportData.location.latitude === 'number' && typeof reportData.location.longitude === 'number') {
    payload.location = {
      latitude: reportData.location.latitude,
      longitude: reportData.location.longitude,
    };
  }

  if (reportData.photoUrl && reportData.photoUrl.trim()) {
    payload.photoUrl = reportData.photoUrl.trim();
  }

  try {
    const response = await apiClient.post('/reports', payload);
    const resData = response.data;

    if (resData && (resData.status === 'success' || resData.data)) {
      const reportResult = resData.data || resData;
      if (reportResult.trackingCode) {
        return {
          success: true,
          trackingCode: reportResult.trackingCode,
          data: reportResult,
          isMock: false,
          message: resData.message || 'Report submitted successfully to live backend API.',
        };
      }
    }
    return {
      success: false,
      error: resData.message || 'API returned an unexpected response format.',
    };
  } catch (error) {
    console.warn('[reportService.submitReport] POST /reports failed:', error);

    // If server responded with an HTTP status error (e.g. 400, 401, 422, 500), return actual backend error
    if (error.response) {
      const serverMsg = error.response.data?.message || error.response.data?.error || `Server error (${error.response.status}).`;
      return {
        success: false,
        error: `Backend error: ${serverMsg}`,
        isMock: false,
      };
    }

    // Only when network is genuinely offline / unreachable, return local demo mode
    const demoHex = Math.random().toString(16).slice(2, 10).toUpperCase();
    const demoTrackingCode = `DEMO-REP-${demoHex}`;

    return {
      success: true,
      trackingCode: demoTrackingCode,
      data: {
        trackingCode: demoTrackingCode,
        status: 'pending',
        category: payload.category,
        description: payload.description,
        location: payload.location,
        photoUrl: payload.photoUrl,
        createdAt: new Date().toISOString(),
      },
      isMock: true,
      message: 'Demo Mode: Backend server offline. Submitted locally with demo tracking code.',
    };
  }
}

/**
 * Validates tracking code format.
 * Real codes: REP-XXXXXXXX (8 hex chars)
 * Demo codes: DEMO-REP-XXXXXXXX (8 hex chars)
 * Sample codes: REP-101, REP-102
 */
export function isValidTrackingCodeFormat(code) {
  const clean = String(code || '').trim().toUpperCase();
  if (/^REP-[A-F0-9]{8}$/.test(clean)) return { valid: true, type: 'real', code: clean };
  if (/^DEMO-REP-[A-F0-9]{8}$/.test(clean)) return { valid: true, type: 'demo', code: clean };
  if (clean === 'REP-101' || clean === 'REP-102') return { valid: true, type: 'sample', code: clean };
  return { valid: false, code: clean };
}

/**
 * Track an existing report by tracking code via GET /api/reports/track/:trackingCode
 */
export async function trackReport(trackingCode) {
  const cleanCode = String(trackingCode || '').trim().toUpperCase();

  if (!cleanCode) {
    return { success: false, error: 'Please enter a tracking code (e.g. REP-A1B2C3D4).' };
  }

  const { valid, type } = isValidTrackingCodeFormat(cleanCode);

  if (!valid) {
    return {
      success: false,
      error: 'Invalid tracking code format. Real tracking codes must follow the format REP-XXXXXXXX (8 hex characters).',
    };
  }

  // Demo / Sample codes must never be sent to the real backend endpoint
  if (type === 'demo' || type === 'sample') {
    const sampleMap = {
      'REP-101': {
        trackingCode: 'REP-101',
        status: 'under_review',
        category: 'elevator',
        description: 'Platform 2 lift out of service at Kalupur Railway Station.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      'REP-102': {
        trackingCode: 'REP-102',
        status: 'pending',
        category: 'obstacle',
        description: 'Construction debris blocking tactile footpath on Ashram Road.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    };

    const mockReport = sampleMap[cleanCode] || {
      trackingCode: cleanCode,
      status: 'pending',
      category: 'ramp',
      description: 'Demo report logged during local offline testing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      report: mockReport,
      isMock: true,
      source: 'mock',
    };
  }

  // Send request for real tracking codes ONLY
  try {
    const response = await apiClient.get(`/reports/track/${cleanCode}`);
    const resData = response.data;

    if (resData && (resData.status === 'success' || resData.data)) {
      const report = resData.data || resData;
      return {
        success: true,
        report,
        isMock: false,
        source: 'backend',
      };
    }

    return {
      success: false,
      error: resData.message || `No report found matching tracking code ${cleanCode}.`,
      isNotFound: true,
    };
  } catch (error) {
    console.warn(`[reportService.trackReport] GET /reports/track/${cleanCode} failed:`, error);

    if (error.response) {
      const serverMsg = error.response.data?.message || error.response.data?.error || `Report not found (${error.response.status}).`;
      return {
        success: false,
        error: serverMsg,
        isNotFound: error.response.status === 404,
      };
    }

    return {
      success: false,
      error: 'Backend API server unreachable. Make sure local backend server is running on http://localhost:5000.',
    };
  }
}

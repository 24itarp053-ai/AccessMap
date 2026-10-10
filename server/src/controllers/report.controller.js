import crypto from 'crypto';
import mongoose from 'mongoose';
import Report, { ALLOWED_CATEGORIES } from '../models/report.model.js';
import Place from '../models/place.model.js';

const isValidHttpUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { description, category, placeId, location, photoUrl } = req.body;

    // Validate description
    if (
      description === undefined ||
      description === null ||
      typeof description !== 'string' ||
      description.trim().length < 10 ||
      description.trim().length > 1000
    ) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Description is required and must be between 10 and 1000 characters'
      });
    }

    // Validate category
    if (
      category === undefined ||
      category === null ||
      typeof category !== 'string' ||
      !ALLOWED_CATEGORIES.includes(category.trim())
    ) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: `Category is required and must be one of: ${ALLOWED_CATEGORIES.join(', ')}`
      });
    }

    // Validate optional placeId
    let validatedPlaceId = null;
    if (placeId !== undefined && placeId !== null && String(placeId).trim() !== '') {
      const trimmedPlaceId = String(placeId).trim();
      if (!mongoose.Types.ObjectId.isValid(trimmedPlaceId)) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Invalid placeId format'
        });
      }

      const existingPlace = await Place.findById(trimmedPlaceId);
      if (!existingPlace) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Referenced placeId does not exist'
        });
      }
      validatedPlaceId = trimmedPlaceId;
    }

    // Validate optional location
    let validatedLocation = undefined;
    if (location !== undefined && location !== null) {
      if (
        typeof location !== 'object' ||
        location.latitude === undefined ||
        location.longitude === undefined ||
        typeof location.latitude !== 'number' ||
        typeof location.longitude !== 'number' ||
        isNaN(location.latitude) ||
        isNaN(location.longitude) ||
        location.latitude < -90 ||
        location.latitude > 90 ||
        location.longitude < -180 ||
        location.longitude > 180
      ) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Location requires both numeric latitude (-90 to 90) and longitude (-180 to 180)'
        });
      }
      validatedLocation = {
        latitude: location.latitude,
        longitude: location.longitude
      };
    }

    // Validate optional photoUrl
    let validatedPhotoUrl = '';
    if (photoUrl !== undefined && photoUrl !== null && String(photoUrl).trim() !== '') {
      const trimmedPhotoUrl = String(photoUrl).trim();
      if (trimmedPhotoUrl.length > 2048 || !isValidHttpUrl(trimmedPhotoUrl)) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'photoUrl must be a valid HTTP or HTTPS URL not exceeding 2048 characters'
        });
      }
      validatedPhotoUrl = trimmedPhotoUrl;
    }

    // Bounded trackingCode generation loop to handle collisions
    let newReport = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      const trackingCode = `REP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      try {
        newReport = await Report.create({
          trackingCode,
          description: description.trim(),
          category: category.trim(),
          placeId: validatedPlaceId,
          location: validatedLocation,
          photoUrl: validatedPhotoUrl,
          status: 'pending' // Always force status to 'pending'
        });
        break;
      } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.trackingCode && attempts < maxAttempts) {
          continue;
        }
        throw err;
      }
    }

    if (!newReport) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
        message: 'Could not generate unique tracking code. Please try again.'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Report submitted successfully',
      data: {
        trackingCode: newReport.trackingCode,
        status: newReport.status,
        category: newReport.category,
        description: newReport.description,
        placeId: newReport.placeId,
        location: newReport.location,
        photoUrl: newReport.photoUrl,
        createdAt: newReport.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const trackReport = async (req, res, next) => {
  try {
    const { trackingCode } = req.params;

    if (!trackingCode || typeof trackingCode !== 'string' || !trackingCode.trim()) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Tracking code is required'
      });
    }

    const cleanCode = trackingCode.trim().toUpperCase();

    if (!/^REP-[A-F0-9]{8}$/.test(cleanCode)) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Invalid tracking code format. Expected format: REP-XXXXXXXX'
      });
    }

    const report = await Report.findOne({ trackingCode: cleanCode });

    if (!report) {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: 'Report not found with the provided tracking code'
      });
    }

    // Return ONLY the 6 safe approved fields
    res.status(200).json({
      status: 'success',
      data: {
        trackingCode: report.trackingCode,
        status: report.status,
        category: report.category,
        description: report.description,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';
import Place from '../models/place.model.js';

const ALLOWED_CATEGORIES = ['transit', 'park', 'hospital', 'government', 'education', 'commercial', 'other'];
const ALLOWED_DATA_STATUSES = ['sample', 'unverified', 'verified'];

const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getPlaces = async (req, res, next) => {
  try {
    const { q, category, area, dataStatus, page, limit } = req.query;
    const filter = {};

    if (q !== undefined) {
      const trimmedQ = String(q).trim();
      if (trimmedQ.length > 100) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Search query (q) must not exceed 100 characters'
        });
      }
      if (trimmedQ.length > 0) {
        const escapedQ = escapeRegex(trimmedQ);
        const searchRegex = new RegExp(escapedQ, 'i');
        filter.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { area: searchRegex },
          { address: searchRegex }
        ];
      }
    }

    if (category !== undefined) {
      const trimmedCategory = String(category).trim();
      if (!ALLOWED_CATEGORIES.includes(trimmedCategory)) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: `Invalid category filter. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`
        });
      }
      filter.category = trimmedCategory;
    }

    if (dataStatus !== undefined) {
      const trimmedStatus = String(dataStatus).trim();
      if (!ALLOWED_DATA_STATUSES.includes(trimmedStatus)) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: `Invalid dataStatus filter. Allowed values: ${ALLOWED_DATA_STATUSES.join(', ')}`
        });
      }
      filter.dataStatus = trimmedStatus;
    }

    if (area !== undefined) {
      const trimmedArea = String(area).trim();
      if (trimmedArea.length === 0 || trimmedArea.length > 100) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Area filter must not be empty or exceed 100 characters'
        });
      }
      filter.area = trimmedArea;
    }

    let pageNum = 1;
    if (page !== undefined) {
      const pageStr = String(page).trim();
      if (!/^\d+$/.test(pageStr) || parseInt(pageStr, 10) < 1) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Parameter "page" must be a positive integer'
        });
      }
      pageNum = parseInt(pageStr, 10);
    }

    let limitNum = 10;
    if (limit !== undefined) {
      const limitStr = String(limit).trim();
      if (!/^\d+$/.test(limitStr) || parseInt(limitStr, 10) < 1) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Parameter "limit" must be a positive integer between 1 and 100'
        });
      }
      const parsedLimit = parseInt(limitStr, 10);
      if (parsedLimit > 100) {
        return res.status(400).json({
          status: 400,
          error: 'Bad Request',
          message: 'Parameter "limit" must not exceed 100'
        });
      }
      limitNum = parsedLimit;
    }

    const skip = (pageNum - 1) * limitNum;

    const [places, total] = await Promise.all([
      Place.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Place.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      results: places.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: { places }
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Invalid place ID format'
      });
    }

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: 'Place not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { place }
    });
  } catch (error) {
    next(error);
  }
};

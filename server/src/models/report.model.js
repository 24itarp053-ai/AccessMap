import mongoose from 'mongoose';

const ALLOWED_CATEGORIES = [
  'wheelchair_access',
  'ramp',
  'elevator',
  'tactile_paving',
  'accessible_toilet',
  'signage',
  'obstacle',
  'other'
];

const ALLOWED_STATUSES = ['pending', 'under_review', 'resolved', 'rejected'];

const reportSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description must not exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Barrier category is required'],
      trim: true,
      enum: ALLOWED_CATEGORIES,
      index: true
    },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      default: null,
      index: true
    },
    location: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2048, 'Photo URL must not exceed 2048 characters']
    },
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export { ALLOWED_CATEGORIES, ALLOWED_STATUSES };
const Report = mongoose.model('Report', reportSchema);

export default Report;

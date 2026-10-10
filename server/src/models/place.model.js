import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: ['transit', 'park', 'hospital', 'government', 'education', 'commercial', 'other'],
      index: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area/neighborhood is required'],
      trim: true,
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
    accessibilityFeatures: {
      type: [String],
      default: []
    },
    accessibilityNotes: {
      type: String,
      trim: true,
      default: ''
    },
    dataStatus: {
      type: String,
      enum: ['sample', 'unverified', 'verified'],
      default: 'unverified',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for filtering by category and area
placeSchema.index({ category: 1, area: 1 });

const Place = mongoose.model('Place', placeSchema);

export default Place;

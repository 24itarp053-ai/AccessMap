import config, { validateConfig } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Place from '../models/place.model.js';

const samplePlaces = [
  {
    name: 'Fictional Demo Transit Terminal',
    description: 'Illustrative sample transit terminal used for development and demonstration testing.',
    category: 'transit',
    address: '100 Sample Avenue, Demo District, Ahmedabad',
    area: 'Demo Area',
    location: {
      latitude: 23.0000,
      longitude: 72.5000
    },
    accessibilityFeatures: ['wheelchair_ramp', 'tactile_paving', 'elevator'],
    accessibilityNotes: 'DEMO DATA ONLY: All accessibility features listed here are fictional placeholders for testing and demo purposes, NOT verified real-world facts.',
    dataStatus: 'sample'
  },
  {
    name: 'Sample Community Park Center',
    description: 'Illustrative sample park facility used for development and demonstration testing.',
    category: 'park',
    address: '200 Mockup Boulevard, Demo District, Ahmedabad',
    area: 'Demo Area',
    location: {
      latitude: 23.0010,
      longitude: 72.5010
    },
    accessibilityFeatures: ['wheelchair_ramp', 'accessible_restroom'],
    accessibilityNotes: 'DEMO DATA ONLY: All accessibility features listed here are fictional placeholders for testing and demo purposes, NOT verified real-world facts.',
    dataStatus: 'sample'
  },
  {
    name: 'Demo General Healthcare Clinic',
    description: 'Illustrative sample health clinic used for development and demonstration testing.',
    category: 'hospital',
    address: '300 Placeholder Street, Demo District, Ahmedabad',
    area: 'Demo Area',
    location: {
      latitude: 23.0020,
      longitude: 72.5020
    },
    accessibilityFeatures: ['wheelchair_ramp', 'accessible_restroom', 'elevator'],
    accessibilityNotes: 'DEMO DATA ONLY: All accessibility features listed here are fictional placeholders for testing and demo purposes, NOT verified real-world facts.',
    dataStatus: 'sample'
  },
  {
    name: 'Mock Academic Study Library',
    description: 'Illustrative sample library used for development and demonstration testing.',
    category: 'education',
    address: '400 Test Road, Demo District, Ahmedabad',
    area: 'Demo Area',
    location: {
      latitude: 23.0030,
      longitude: 72.5030
    },
    accessibilityFeatures: ['braille_signage', 'elevator'],
    accessibilityNotes: 'DEMO DATA ONLY: All accessibility features listed here are fictional placeholders for testing and demo purposes, NOT verified real-world facts.',
    dataStatus: 'sample'
  },
  {
    name: 'Sample Commercial Shopping Complex',
    description: 'Illustrative sample shopping complex used for development and demonstration testing.',
    category: 'commercial',
    address: '500 Fictional Plaza, Demo District, Ahmedabad',
    area: 'Demo Area',
    location: {
      latitude: 23.0040,
      longitude: 72.5040
    },
    accessibilityFeatures: ['accessible_parking', 'elevator', 'wheelchair_ramp'],
    accessibilityNotes: 'DEMO DATA ONLY: All accessibility features listed here are fictional placeholders for testing and demo purposes, NOT verified real-world facts.',
    dataStatus: 'sample'
  }
];

const seedPlaces = async () => {
  try {
    validateConfig();
    await connectDatabase();

    // Preserve deletion scope: strictly delete records where dataStatus === 'sample'
    const deleteResult = await Place.deleteMany({ dataStatus: 'sample' });
    console.log(`Cleared ${deleteResult.deletedCount} existing sample place records.`);

    const createdPlaces = await Place.insertMany(samplePlaces);
    console.log(`Successfully seeded ${createdPlaces.length} fictional sample places.`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
};

seedPlaces();

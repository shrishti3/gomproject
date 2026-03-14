// This script initializes sample data in MongoDB
// Run with: node scripts/init-db.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/madmann';

async function initDB() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('madmann');

    // Sample projects
    const sampleProjects = [
      {
        category: 'ODM',
        projectName: 'Aerospace Component Manufacturing',
        description: 'High-precision components for commercial and defense applications',
      },
      {
        category: 'SCM',
        projectName: 'Electronics Sourcing Initiative',
        description: 'Strategic component sourcing from Indian manufacturing partners',
      },
      {
        category: 'EMS',
        projectName: 'Full-Cycle EMS Production',
        description: 'From prototype to mass production electronics manufacturing',
      },
      {
        category: 'Wire Harnessing',
        projectName: 'Defense Wire Harnessing',
        description: 'Specialized wire solutions for automotive, EV, and defense sectors',
      },
    ];

    // Clear existing projects
    const projectsCollection = db.collection('projects');
    await projectsCollection.deleteMany({});

    // Insert sample projects
    const result = await projectsCollection.insertMany(sampleProjects);
    console.log(`✓ Inserted ${result.insertedCount} sample projects`);

    // Create indexes
    await projectsCollection.createIndex({ category: 1 });
    console.log('✓ Created database indexes');

    console.log('\n✓ Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDB();

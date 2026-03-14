// Initialize MongoDB with collections and indexes
db = db.getSiblingDB('madmann_db');

// Create Inquiry Collection
db.createCollection('inquiries');
db.inquiries.createIndex({ email: 1 });
db.inquiries.createIndex({ createdAt: -1 });
db.inquiries.createIndex({ status: 1 });

// Create Project Collection
db.createCollection('projects');
db.projects.createIndex({ projectName: 1 });
db.projects.createIndex({ createdAt: -1 });
db.projects.createIndex({ category: 1 });

// Create Contact Collection
db.createCollection('contacts');
db.contacts.createIndex({ email: 1 });
db.contacts.createIndex({ createdAt: -1 });

// Insert sample data for reference
db.projects.insertMany([
  {
    _id: ObjectId(),
    projectName: "Aerospace Component Manufacturing",
    category: "ODM",
    description: "High-precision aerospace components for commercial and defense applications",
    status: "active",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    projectName: "Electronics Sourcing Initiative",
    category: "SCM",
    description: "Strategic component sourcing from Indian manufacturing partners",
    status: "active",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    projectName: "Full-Cycle EMS Production",
    category: "EMS",
    description: "From prototype to mass production electronics manufacturing",
    status: "active",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    projectName: "Defense Wire Harnessing",
    category: "Wire Harnessing",
    description: "Specialized wire solutions for automotive, EV, and defense sectors",
    status: "active",
    createdAt: new Date()
  }
]);

print("MongoDB initialization completed successfully");

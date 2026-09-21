import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const LOCAL_URI = "mongodb://127.0.0.1:27017/medsync";
const ATLAS_URI = process.env.MONGODB_URI;

console.log("-----------------------------------------");
console.log("MedSync Database Migration: Local -> Atlas");
console.log("-----------------------------------------");

async function migrate() {
  if (!ATLAS_URI || !ATLAS_URI.startsWith('mongodb+srv://')) {
    console.error("Error: ATLAS_URI is not properly configured in backend/.env");
    process.exit(1);
  }

  console.log("Connecting to Local MongoDB:", LOCAL_URI);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("Connected to Local MongoDB successfully.");

  console.log("Connecting to Cloud MongoDB Atlas...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log("Connected to MongoDB Atlas successfully.");

  const localDb = localConn.db;
  const atlasDb = atlasConn.db;

  const collections = await localDb.listCollections().toArray();
  console.log(`Found ${collections.length} collections locally:`, collections.map(c => c.name));

  for (const collInfo of collections) {
    const collName = collInfo.name;
    if (collName.startsWith('system.')) continue;

    console.log(`\nMigrating collection: [${collName}]...`);
    const localCollection = localDb.collection(collName);
    const atlasCollection = atlasDb.collection(collName);

    const docs = await localCollection.find({}).toArray();
    console.log(`  Found ${docs.length} documents in local [${collName}].`);

    if (docs.length > 0) {
      // Clear atlas collection first to avoid duplicates or conflicting indexes
      await atlasCollection.deleteMany({});
      
      const insertResult = await atlasCollection.insertMany(docs);
      console.log(`  Successfully inserted ${insertResult.insertedCount} documents into Atlas [${collName}].`);
    } else {
      console.log(`  Collection [${collName}] is empty, skipping insert.`);
    }
  }

  console.log("\n-----------------------------------------");
  console.log("All collections and data successfully migrated to Atlas!");
  console.log("-----------------------------------------");

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});

const mongoose = require('mongoose');
require('dotenv').config();

async function checkAll() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await mongoose.connection.db.collection('users').find(
    {},
    { projection: { name: 1, email: 1, role: 1, isVerified: 1, isBloodDonor: 1 } }
  ).toArray();
  
  console.log('ALL USERS IN DATABASE:');
  users.forEach(u => {
    console.log(`  ${u.name} | ${u.email} | role:${u.role} | verified:${u.isVerified} | donor:${u.isBloodDonor}`);
  });
  console.log('Total:', users.length);

  // Verify ALL unverified doctors/hospitals
  const result = await mongoose.connection.db.collection('users').updateMany(
    { role: { $in: ['doctor', 'hospital'] }, isVerified: false },
    { $set: { isVerified: true } }
  );
  console.log('Newly verified:', result.modifiedCount);

  await mongoose.disconnect();
  process.exit(0);
}

checkAll().catch(e => { console.error(e); process.exit(1); });

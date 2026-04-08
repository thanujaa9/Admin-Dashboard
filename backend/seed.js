const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Metric = require('./models/Metric');

dotenv.config();

const sampleData = [
  { label: 'Jan', value: 400, category: 'sales' },
  { label: 'Feb', value: 300, category: 'sales' },
  { label: 'Mar', value: 600, category: 'sales' },
  { label: 'Apr', value: 800, category: 'sales' },
  { label: 'Jan', value: 50, category: 'signups' },
  { label: 'Feb', value: 80, category: 'signups' },
  { label: 'Mar', value: 150, category: 'signups' },
  { label: 'Apr', value: 200, category: 'signups' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Metric.deleteMany(); // Clears old data
    await Metric.insertMany(sampleData);
    console.log('✅ Mock Data Seeded Successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
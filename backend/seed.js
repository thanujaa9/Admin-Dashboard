const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Metric = require('./models/Metric');

const users = [
  { name: 'Super Admin', email: 'admin@demo.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe',    email: 'john@demo.com',  password: 'user123',  role: 'user'  },
  { name: 'Jane Smith',  email: 'jane@demo.com',  password: 'user123',  role: 'user'  },
  { name: 'Alice Ray',   email: 'alice@demo.com', password: 'user123',  role: 'user'  },
  { name: 'Bob Kumar',   email: 'bob@demo.com',   password: 'user123',  role: 'user'  },
  { name: 'thanuja',   email: 'thanu@gmail.com',   password: 'user123',  role: 'user'  },
];

const metrics = [
  { label: 'Jan', value: 400,  category: 'sales'   },
  { label: 'Feb', value: 300,  category: 'sales'   },
  { label: 'Mar', value: 600,  category: 'sales'   },
  { label: 'Apr', value: 800,  category: 'sales'   },
  { label: 'May', value: 750,  category: 'sales'   },
  { label: 'Jun', value: 900,  category: 'sales'   },
  { label: 'Jan', value: 50,   category: 'signups' },
  { label: 'Feb', value: 80,   category: 'signups' },
  { label: 'Mar', value: 150,  category: 'signups' },
  { label: 'Apr', value: 200,  category: 'signups' },
  { label: 'May', value: 180,  category: 'signups' },
  { label: 'Jun', value: 220,  category: 'signups' },
  { label: 'Jan', value: 320,  category: 'activeUsers' },
  { label: 'Feb', value: 280,  category: 'activeUsers' },
  { label: 'Mar', value: 410,  category: 'activeUsers' },
  { label: 'Apr', value: 530,  category: 'activeUsers' },
  { label: 'May', value: 490,  category: 'activeUsers' },
  { label: 'Jun', value: 610,  category: 'activeUsers' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');

    await User.deleteMany();
    await Metric.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10)
      }))
    );
    await User.insertMany(hashedUsers);
    console.log('✅ Users seeded');

    await Metric.insertMany(metrics);
    console.log('✅ Metrics seeded');

    console.log('\n📋 Login Credentials:');
    console.log('Admin  → admin@demo.com / admin123');
    console.log('User   → john@demo.com  / user123');

    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
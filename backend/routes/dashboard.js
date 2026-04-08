const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get('/stats', auth, async (req, res) => {
  try {
    const metrics = await Metric.find();

    const grouped = {};
    metrics.forEach(m => {
      if (!grouped[m.category]) {
        grouped[m.category] = { labels: [], values: [] };
      }
      grouped[m.category].labels.push(m.label);
      grouped[m.category].values.push(m.value);
    });

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const regularUsers = totalUsers - adminCount;

    const salesMetrics = metrics.filter(m => m.category === 'sales');
    const totalSales = salesMetrics.reduce((sum, m) => sum + m.value, 0);

    const signupMetrics = metrics.filter(m => m.category === 'signups');
    const totalSignups = signupMetrics.reduce((sum, m) => sum + m.value, 0);

    res.json({
      summary: {
        totalUsers,
        adminCount,
        regularUsers,
        totalSales,
        totalSignups
      },
      charts: grouped  
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
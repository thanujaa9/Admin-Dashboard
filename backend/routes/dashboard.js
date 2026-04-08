const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

router.get('/stats', async (req, res) => {
  try {
    const metrics = await Metric.find();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
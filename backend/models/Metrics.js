const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  label: String,
  value: Number,
  category: String 
});

module.exports = mongoose.model('Metric', MetricSchema);
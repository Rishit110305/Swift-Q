const Department = require('../models/Department');

module.exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find(); 
    res.json(departments); // json is a format == key-value pairs or arrays format easy n readable for us 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Health Controller
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Text-to-Speech server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

module.exports = {
  getHealth
};

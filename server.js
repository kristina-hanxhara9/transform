const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the root directory FIRST
// This is important! It must come before the catch-all route
app.use(express.static(__dirname));

// Log all requests to help troubleshoot
app.use((req, res, next) => {
  console.log(`Request for: ${req.url}`);
  next();
});

// Only send index.html for routes that aren't files
// This catch-all should only trigger for navigation routes, not for static assets
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Root directory: ${__dirname}`);
});
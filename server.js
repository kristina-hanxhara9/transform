const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Log all requests to help troubleshoot
app.use((req, res, next) => {
  console.log(`Request for: ${req.url}`);
  next();
});

// Catch-all route to serve your index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Root directory: ${__dirname}`);
});
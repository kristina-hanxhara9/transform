const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve static files from the Dewi-1.0.0 directory with proper paths
app.use('/Dewi-1.0.0', express.static(path.join(__dirname, 'Dewi-1.0.0')));

// Specifically serve assets with correct MIME types
app.use('/Dewi-1.0.0/assets/css', express.static(path.join(__dirname, 'Dewi-1.0.0/assets/css'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/Dewi-1.0.0/assets/js', express.static(path.join(__dirname, 'Dewi-1.0.0/assets/js'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/Dewi-1.0.0/assets/img', express.static(path.join(__dirname, 'Dewi-1.0.0/assets/img')));
app.use('/Dewi-1.0.0/assets/vendor', express.static(path.join(__dirname, 'Dewi-1.0.0/assets/vendor')));

// Handle root route - serve index.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle any other routes that might be part of your single-page application
app.get('*', (req, res) => {
  // Try to serve the file directly if it exists
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, default to index.html for SPA routing
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
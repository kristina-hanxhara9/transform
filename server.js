const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Helper function to set headers for JavaScript files
const setJsHeaders = (res, filePath) => {
  if (filePath.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
};

// Helper function to set headers for CSS files
const setCssHeaders = (res, filePath) => {
  if (filePath.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
};

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve the Dewi-1.0.0 directory with correct MIME types for ALL files
app.use('/Dewi-1.0.0', express.static(path.join(__dirname, 'Dewi-1.0.0'), {
  setHeaders: (res, filePath) => {
    // Set correct MIME types based on file extension
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (filePath.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (filePath.endsWith('.eot')) {
      res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Explicitly set up routes for specific vendor directories that contain JS
const vendorJsDirs = [
  '/Dewi-1.0.0/assets/vendor/aos',
  '/Dewi-1.0.0/assets/vendor/bootstrap/js',
  '/Dewi-1.0.0/assets/vendor/glightbox/js',
  '/Dewi-1.0.0/assets/vendor/imagesloaded',
  '/Dewi-1.0.0/assets/vendor/isotope-layout',
  '/Dewi-1.0.0/assets/vendor/php-email-form',
  '/Dewi-1.0.0/assets/vendor/purecounter',
  '/Dewi-1.0.0/assets/vendor/swiper'
];

vendorJsDirs.forEach(dir => {
  app.use(dir, express.static(path.join(__dirname, dir.substring(1)), {
    setHeaders: setJsHeaders
  }));
});

// Explicitly set up routes for css directories
const vendorCssDirs = [
  '/Dewi-1.0.0/assets/vendor/aos',
  '/Dewi-1.0.0/assets/vendor/bootstrap/css',
  '/Dewi-1.0.0/assets/vendor/bootstrap-icons',
  '/Dewi-1.0.0/assets/vendor/boxicons/css',
  '/Dewi-1.0.0/assets/vendor/glightbox/css',
  '/Dewi-1.0.0/assets/vendor/swiper',
  '/Dewi-1.0.0/assets/css'
];

vendorCssDirs.forEach(dir => {
  app.use(dir, express.static(path.join(__dirname, dir.substring(1)), {
    setHeaders: setCssHeaders
  }));
});

// Handle root route - serve index.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add a special route for main.js to explicitly set the content type
app.get('/Dewi-1.0.0/assets/js/main.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'Dewi-1.0.0/assets/js/main.js'));
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
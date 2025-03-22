const express = require('express');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// Log all requests to see what's happening
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Custom middleware to serve files with explicit Content-Type
app.use((req, res, next) => {
  // Skip if not requesting a file
  if (!req.path.includes('.')) {
    return next();
  }

  // Get the absolute file path
  let filePath;
  if (req.path.startsWith('/Dewi-1.0.0/')) {
    filePath = path.join(__dirname, req.path);
  } else {
    // Check if the file exists directly at the root
    filePath = path.join(__dirname, req.path);
    if (!fs.existsSync(filePath)) {
      // Try with Dewi-1.0.0 prefix if not found at root
      filePath = path.join(__dirname, 'Dewi-1.0.0', req.path);
    }
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return next();
  }

  // Get MIME type and set explicit content type
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  console.log(`Serving ${filePath} with Content-Type: ${mimeType}`);

  // Set proper content type
  res.setHeader('Content-Type', mimeType);
  
  // Stream the file
  fs.createReadStream(filePath).pipe(res);
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Handle root route - serve index.html from the root directory
app.get('/', (req, res) => {
  console.log('Serving index.html from root');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle any other routes
app.get('*', (req, res) => {
  if (!req.path.includes('.')) {
    console.log(`No file extension in path: ${req.path}, serving index.html`);
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  
  // If we got here, the custom middleware didn't handle the file
  console.log(`Warning: Reached the catch-all route for: ${req.path}`);
  res.status(404).send('File not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Root directory: ${path.join(__dirname)}`);
  console.log(`Dewi-1.0.0 directory: ${path.join(__dirname, 'Dewi-1.0.0')}`);
  
  // List files in root and Dewi directories to debug
  try {
    console.log('\nFiles in root directory:');
    fs.readdirSync(__dirname).forEach(file => {
      console.log(` - ${file}`);
    });
    
    console.log('\nFiles in Dewi-1.0.0 directory:');
    fs.readdirSync(path.join(__dirname, 'Dewi-1.0.0')).forEach(file => {
      console.log(` - ${file}`);
    });
  } catch (error) {
    console.error('Error listing files:', error);
  }
});
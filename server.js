require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
try {
  // Load the private key JSON file you downloaded from Firebase Console
  const serviceAccount = require('./serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Using the database URL from your frontend config
    databaseURL: "https://pdftoexcel-43588-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  console.log('✅ Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK could not initialize. Please ensure serviceAccountKey.json is present in the directory.');
}

const db = admin.apps.length > 0 ? admin.database() : null;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 image uploads

// Serve your static frontend files (HTML, JS, CSS) from the current directory
app.use(express.static(path.join(__dirname)));

// --- API ENDPOINTS ---

// A simple test route
app.get('/api/status', (req, res) => {
  res.json({ status: 'TindaPOS Backend is running!', timestamp: Date.now() });
});

// Route to handle image uploads securely via backend
app.post('/api/upload', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image data provided.' });

    const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD || 'dki7swxo5';
    const CLOUDINARY_PRESET = process.env.CLOUDINARY_PRESET || 'ml_default';
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: image,
        upload_preset: CLOUDINARY_PRESET
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');

    res.status(200).json({ secure_url: data.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

// Example: A route to eventually handle saving products securely on the server
app.post('/api/products', async (req, res) => {
  const newProduct = req.body;
  console.log('Received product data from frontend:', newProduct);
  
  if (!db) {
    return res.status(500).json({ error: 'Database is not initialized on the server.' });
  }

  try {
    // Create a new reference in the "products" node
    const newProductRef = db.ref('products').push();
    // Save the data to Firebase Realtime Database
    await newProductRef.set({ ...newProduct, createdAt: Date.now() });
    
    res.status(201).json({ message: 'Product successfully saved to database', id: newProductRef.key });
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    res.status(500).json({ error: 'Failed to save product to database.' });
  }
});

// Route to handle editing a product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  
  if (!db) return res.status(500).json({ error: 'Database is not initialized on the server.' });

  try {
    await db.ref(`products/${id}`).set(updatedProduct);
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating Firebase:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Route to handle deleting a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!db) return res.status(500).json({ error: 'Database is not initialized on the server.' });

  try {
    await db.ref(`products/${id}`).remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// Catch-all route: If the user visits any URL, serve the main POS HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sari-sari-pos (1).html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
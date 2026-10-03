const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes');
require('dotenv').config();
const connectDB = require('./models/db.js');

// Connect to MongoDB
connectDB();
console.log('App started!');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});
// Export app for testing
module.exports = app;
// This is a simple Express application that connects to a MongoDB database,
// uses session management, and serves static files. It also sets up a view engine
// and includes error handling middleware. The application listens on a specified port

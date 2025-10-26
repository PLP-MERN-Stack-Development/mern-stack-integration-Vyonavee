require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { connect } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/posts', require('./routes/posts'));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connect(process.env.MONGO_URI).then(()=> {
  console.log('Connected to MongoDB');
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}).catch(err=>{
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

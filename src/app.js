const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/product.route');
const userRoutes = require("./routes/user.route");
const connectDB = require("./config/db")
dotenv.config();

const app = express();

app.use(express.json());


connectDB();

app.use('/user', userRoutes);
app.use('/product', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

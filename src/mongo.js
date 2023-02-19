const logger = require('./logger');
const mongoose = require('mongoose');

module.exports = {
  init: async () => {
    await mongoose.connect("mongodb+srv://sanjay:sanjay@cluster0.zxwt4it.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected.');
    });

    mongoose.connection.on('err', (err) => {
      logger.error(`MongoDB connection error: \n ${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });
  },
};

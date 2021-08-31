const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.REACT_APP_PORT,
  CHOKIDAR_USEPOLLING: process.env.REACT_APP_CHOKIDAR_USEPOLLING,
  APP_NAME: process.env.REACT_APP_APP_NAME,
  SERVER_URL: process.env.REACT_APP_SERVER_URL,
  SOCKET_IO_ENDPOINT: process.env.REACT_APP_SERVER_URL,
  MAX_CART_LIMIT: process.env.MAX_CART_LIMIT, 
  GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL
}

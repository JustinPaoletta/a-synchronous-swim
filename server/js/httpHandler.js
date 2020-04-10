const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  // if req.method === GET && req.url === '/'
  if ( req.method === 'GET' && req.url === '/' ) {
    // array of up down left right
    let myResponses = ['up', 'down', 'left', 'right'];
    // random int 0 through 3
    let randNum = Math.floor(Math.random() * 4);
    // make the data something or another (response.write array at index of random int)
    res.write(myResponses[randNum]);
  }
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};

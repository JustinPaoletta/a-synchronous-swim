const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messQueue = require('./messageQueue.js');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

// MAY USE THIS AS OUR MESSAGE QUEUE LATER

// let messageQueue = null;
// module.exports.initialize = (queue) => {
//   messageQueue = queue;
// };


// router function takes in the req and serves up a response
module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  // handle get request
  if ( req.method === 'GET' && req.url === '/' ) {
    res.writeHead(200, headers);
    let deq = messQueue.dequeue();
    if (deq === undefined) {
      res.write('rest');
    } else {
      res.write(deq);
    }
    res.end();
    next(); // invoke next() at the end of a request to help with testing!
  } else if ( req.method === 'GET' && req.url === '/background.jpg' ){
    // res.setHeader('Content-Type', 'image/jpeg')  //// the correct way to do this, but not present on the mock
    let headerobj = {
      'access-control-allow-origin': "*",
      'access-control-allow-methods': "GET, POST, PUT, DELETE, OPTIONS",
      'access-control-allow-headers': "content-type, accept",
      'access-control-max-age': 10,
      'Content-Type': "image/jpeg"
    }
    res.writeHead(200, headerobj);

    //construct the path
    let filename = path.join('.', 'img', 'background.jpg')
    //open the read stream
    var readStream = fs.createReadStream(filename);
    // pipe the read stream into the response
    readStream.on('open', function () {
      console.log('we made it ------------------------------')
      readStream.pipe(res);
      res.end();
      next();
    });

    readStream.on('error', function(err) {
      console.log('not here xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      res.end(err);
      next();
    });

  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  } else {
    //console.log('this is the url that gets 404ed', req.url)
    res.writeHead(404, headers);
    res.end();
    next();
  }

};

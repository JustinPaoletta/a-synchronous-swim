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

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }
  // handle get request
  else if ( req.method === 'GET' && req.url === '/' ) {
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
    };


    let filename = path.join('.', 'img', 'background.jpg')
    var readStream = fs.createReadStream(filename);

    readStream.on('open', function () {
      readStream.pipe(res);
    });

    readStream.on('error', function(err) {
      res.writeHead(400, headerobj);
      res.end(err);
      next();
    });

    readStream.on('end', () => {
      console.log('Finished streaming!');
      res.writeHead(200, headerobj);
      res.end()
      next();
    });

  } else if ( req.method === 'POST' && req.url === '/background.jpg' ){


    let filename = path.join('.', 'img', 'background.jpg');

    let body = Buffer.alloc(0);

    req.on('data', (chunk) => {
      body = Buffer.concat([body, chunk]);
      console.log(body, "THE BUFFER");

    })
    // let testing = multipart.getFile(body).data;
    req.on('end', () => {
      var file = multipart.getFile(body);
      console.log(file, "FILE")
      fs.writeFile(filename, file.data /*FILEDATA*/, (err) => {
        res.writeHead(err ? 400 : 201, headers);
        res.end();
        next();
      });
    });


  } else {
    res.writeHead(404, headers);
    res.end();
    next();
  }

};


















    /////////////////////////////////////////////////////////////////////////////////////////
    //req is our readable stream and we pipe it to the writeStream
    // so we should pipe it after reading it but inside of req.on  req.pipe is never called
    // req.write(writeStream);

    // req.on('readable', function(){
    //   console.log('trying to pipe------------------------------');
    // })

    // writeStream.on('pipe', () => console.log('Writing pipe started!'));

    // writeStream.on('finish', () => {
    //   console.log('Finished writing!'); // reasonably sure the multipart file processing will happen here
    //   res.writeHead(201, headers);
    //   res.end()
    //   next();
    // });

    // writeStream.on('error', function(err) {
    //   res.writeHead(400, headers);
    //   console.log(err);
    //   res.end(err);
    //   next();
    // });

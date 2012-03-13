#vectogr.am

API to convert image url to SVG path

##install


```
  npm install vectogram
```

##how do I use this?

run a vectogram server instance

```javascript
var Vectogram = require('vectogram');

var options = { port: 80, host: '127.0.0.1' };

var server = new Vectogram(options) //start up the server
```

now you can make http requests to the server.

Resource:

* `GET` `http://server_url.com/url_to_image`

parameters:

* `pathonly` (optional - defaults to `false`)

values: 

* `true`
* `false`

Example http client request:

```javascript
var http = require('http');

var options = { 
  host: '127.0.0.1'
, port: 80
, path: 'http://jquery.com/demo/thickbox/images/plant4.jpg'
};

var request = http.get(options, function (res) {
  var reply = '';
  res.on('data', function (chunk) {
    reply += chunk;
  });
  res.on('end', function () {
    console.log('CLIENT: reply', reply)
  });
});

req.on('error', function (e) {
  console.log('http client error:', e)
});

```
  
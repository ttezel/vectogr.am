#vectogr.am

API to convert image url to SVG path over http.

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

now you can make http requests to this server.

Resource:

* `GET` `http://127.0.0.1/url_to_image`

parameter:

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

request.on('error', function (e) {
  console.log('http client error:', e)
});

```
  
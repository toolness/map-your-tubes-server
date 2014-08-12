This is a simple server that allows a small group of people using the
[map-your-tubes][] CLI to collaboratively build a map of the internet.

## Quick Start

```
git clone https://github.com/toolness/map-your-tubes-server.git
cd map-your-tubes-server
npm install
node app.js
```

This will start the server at http://localhost:3000. If you want to
host the server to the outside world, set the following environment
variables before running `node app.js`:

* `PORT` should be the port to listen on. Defaults to 3000.
* `ORIGIN` should be the origin that the server can be accessed at
  from CLI and browser clients. Defaults to http://localhost:3000.

Once your server is up and running, you'll want to connect one or
more CLI clients to it. See the README for [map-your-tubes][] for
more on this.

After at least one client is connected, visit the root of your server
with your browser to initiate a distributed traceroute to any
hostname or IP address of your choosing. The routes from each client
will then be mapped on the page in real-time.

## Limitations

The [GeoLite2 Database][] the front-end uses to geolocate IP addresses
appears to include the endpoints of traceroutes, but few to
none of the points between. This means that the tool is far less useful
than I was hoping it'd be, as the generated "internet map" is usually
just a straight line from each client to the destination address. Alas.

  [map-your-tubes]: https://github.com/toolness/map-your-tubes
  [GeoLite2 Database]: http://dev.maxmind.com/geoip/geoip2/geolite2/

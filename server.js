const JSON_SERVER = require( 'json-server' );
const SERVER      = JSON_SERVER.create();
const MIDDLEWARES = JSON_SERVER.defaults();

//YOUR SEED FILE
const seed        = require( './db.js' );

// because your seedfile exports a function, you should run it to get the generated json object
const data        = seed();

// pass the `data` json object to `json-server`'s router function to generate the necessary routes
const ROUTER      = JSON_SERVER.router(data);

let isAuthenticated = true;

// it is recommended to use the bodyParser middleware before any other middleware in your application
SERVER.use( JSON_SERVER.bodyParser );

//your Authentication middleware (simplified to check the variable directly
// feel free to go back to the function approach if your authentication checks are more complex
SERVER.use( function ( req, res, next ) {
  if ( isAuthenticated ) {
    next();
  } else {
    res.status( 401 ).send( "Unauthorized!" )
  }
} );

// the logout endpoint
SERVER.get( '/logout', function ( req, res ) {
  isAuthenticated = false;
  res.status(200).send('logged out');
} );

//middlewares required by json-server to run correctly
// this sets up the static serving, Gzip, logger,
// the internal json-server body-parser .. etc
SERVER.use( MIDDLEWARES );

/*
I am not sure why you are rewriting this route like this,
because this subtle rewrite changes how you get/patch a single resource
so instead of getting single resource you made it search for
all resources that has the provided `id`, thus, it returns
an array of resources which in your case will always be an array
with single resource, plus it will prevent patching "modifying"
all `/home/:id` resources.

anyways, I kept it as it is.
if you really know what you are doing here, ignore all the above,
otherwise, try to disable this middleware to know what I mean.
*/
SERVER.use(JSON_SERVER.rewriter({
  '/home/:id': '/home?id=:id'
}));

// this is where `json-server`'s magic happens ;)
SERVER.use( ROUTER );

/*
start the application by listening to port 3000,
Although this won't print the nice starting message you see when
running `json-server` as CLI command, it still runs the app correctly.
*/
SERVER.listen( 3000, function () {
  console.log( 'http://localhost:3000' );
} );

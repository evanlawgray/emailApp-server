const express = require( 'express' );
const pgp = require( 'pg-promise' )({});
const app = express();
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const json = bodyParser.json;

const db = pgp({
  host: 'localhost',
  port: '5432',
  database: 'practice',
  user: 'owner',
  password: 'Atarax1a309'
});

module.exports = db;

app.use( express.static( __dirname + '/public/build' ) );

app.get( '/', (req, res) => {
  console.log( 'Getting the react app...' )
  res.send('./public/build')
});

const apiRouter = express.Router();
const apiRoutes = require( './routes/api' );

app.use( json() );
app.use( bodyParser.urlencoded({ extended: false }) ) ;

app.use( '/api', apiRoutes( apiRouter ) );

const PORT = 3000;

app.listen( PORT, err => {
  err && console.log( `Error: ${err}. Failed to connect to server` );

  console.log(`App is listening on port ${PORT}`);
});
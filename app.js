const express = require( 'express' );
const pgp = require( 'pg-promise' )({});
const app = express();
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const json = bodyParser.json;
const cookieParser = require('cookie-parser');

const db = pgp({
  host: 'localhost',
  port: '5432',
  database: 'emailclient',
  user: 'owner',
  password: 'Atarax1a309'
});

module.exports = db;

app.use( express.static( __dirname + '/public/build' ) );

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.get( '/', (req, res) => {
  console.log( 'Getting the react app...' )
  res.send('./public/build')
});

const apiRouter = express.Router();
const apiRoutes = require( './routes/api' );

const authRouter = express.Router();
const authRoutes = require( './routes/auth' );

app.use( json() );
app.use( bodyParser.urlencoded({ extended: false }) ) ;
app.use(cookieParser());

app.use( '/api', apiRoutes( apiRouter ));
app.use( '/auth', authRoutes( authRouter ));

const PORT = 3001;

app.listen( PORT, err => {
  err && console.log( `Error: ${err}. Failed to connect to server` );

  console.log(`App is listening on port ${PORT}`);
});

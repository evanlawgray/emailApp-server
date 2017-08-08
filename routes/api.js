const cors = require( 'cors' );
const db = require( '../app' );

module.exports = ( router ) => {

  router.use( cors({
    origin: ['http://localhost:3001'],
    credentials: true
  }));

  router.get( '/lessons', ( req, res ) => {
    db.any( 'SELECT * from lessons' )
      .then( posts => {
        return posts
          ? res.status( 200 ).json( posts )
          : res.status( 403 ).send
      })
      .catch( err => {
        return res.status( 500 ).send();
      })
  });

  return router;
}

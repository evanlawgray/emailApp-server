const cors = require( 'cors' );
const db = require( '../app' );

module.exports = ( router ) => {

  router.use( cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }));

  router.get( '/emails/:userId', ( req, res ) => {
    const { userId } = req.params;

    db.any( `SELECT * from emails WHERE "recipientId"=${ userId }` )
      .then( posts => {
        return posts
          ? res.status( 200 ).json( posts )
          : res.status( 403 ).send
      })
      .catch( err => {
        console.log(err)
        return res.status( 500 ).send();
      })
  });

  return router;
}

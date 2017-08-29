const cors = require( 'cors' );
const db = require( '../app' );
const jwt = require( 'jsonwebtoken' )

module.exports = function( router ) {

  router.post( '/login', (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);

    db.any( `SELECT * FROM users WHERE email='${email}' AND password=crypt('${password}', password);` )
      .then( users => {
        if(users.length) {
          const session = {
            user_email: users[0].email
          };

          const JWT = jwt.sign(session, '2l3k45j8a-a-0iga', {expiresIn: '2hr'});

          res.status(200).cookie('redit_session', JWT, {
            secure: false,
            maxAge: 7200000,
            httpOnly: true
          }).send(`${users[0].id}`);
        } else { res.status(403).send('Invalid username or password...') }
      }).catch( error => {
        console.log(error);
        res.status(500).send(error);
      });
  });

  return router;
}

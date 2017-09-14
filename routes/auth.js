const cors = require( 'cors' );
const db = require( '../app' );
const jwt = require( 'jsonwebtoken' )

module.exports = function( router ) {

  router.post( '/login', (req, res) => {
    const {email, password} = req.body;

    db.any( `SELECT * FROM users WHERE email='${email}' AND password=crypt('${password}', password);` )
      .then( users => {
        if(users.length) {
          const session = {
            user_email: users[0].email
          };

          const JWT = jwt.sign(session, '2l3k45j8a-a-0iga', {expiresIn: '2hr'});

          res.status(200).cookie('email_session', JWT, {
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

  router.post( '/signup', ( req, res ) => {
    const {username, email, password} = req.body;

    db.any( `SELECT * FROM users WHERE email='${email}' AND password=crypt('${password}', password);` )
      .then( users => {
        if( users.length ) {
          res.status(403).send('The submitted username or password already exists. Please try again.');
        } else {
          db.any( `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', crypt('${password}', gen_salt('bf', 8)));` )
            .then( ( ) => res.status(200).send('Your user account has been created') )
            .catch( error => {
              console.log( 'The error is:', error );
              res.status(500).send('There was a problem creating your account. Please try again later.');
            });
        }
      }).catch( error => res.status(500).send('error') );
  });

  return router;
}

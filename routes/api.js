const cors = require( 'cors' );
const db = require( '../app' );

module.exports = ( router ) => {

  router.use( cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }));

  router.get( '/emails/:userId', ( req, res ) => {
    const { userId } = req.params;

    db.any( `SELECT * from emails WHERE "recipientId"=${ userId } ORDER BY id DESC` )
      .then( results => {
        const posts = results.slice(0);
        return posts
          ? res.status( 200 ).json( posts )
          : res.status( 403 ).send
      })
      .catch( err => {
        return res.status( 500 ).send();
      })
  });

  router.post( '/sendEmail', ( req, res ) => {
    const { userId, recipient, subject, message } = req.body;

    let messageData = {
      recipient: recipient,
      subject: subject,
      message: message,
      authorId: userId,
    }

    db.any( `SELECT * FROM users WHERE "id"=${ userId };` )
      .then( userInfo => {
        if( !userInfo.length ) res.status( 403 ).send('There was an error loading your account information. Please log out then try again after signing in.');

        if( userInfo[0] ) {
          messageData.author = userInfo[0].username;
        } else {
          throw Error;
        }
        return messageData;
      }).then ( messageData => {
          db.any( `SELECT * FROM users WHERE "username"='${ recipient }';` )
            .then( recipientInfo => {
              if( !recipientInfo.length ) res.status( 400 ).send( 'Your message could not be delivered because the recipient you identified does not have an account.' );

              if( recipientInfo[0] ) {
                messageData.recipientId = recipientInfo[0].id
              } else {
                throw Error;
              }

              return messageData;
            }).then( messageData => {
                db.any( `INSERT INTO emails ( author, recipient, subject, message, "authorId", "recipientId" )
                  VALUES ( '${ messageData.author }', '${ messageData.recipient }', '${ messageData.subject }', '${ messageData.message }', '${ messageData.authorId }', '${ messageData.recipientId }' );` )
                  .then( () => res.status( 200 ).send( 'Your message has been sent!' ) )
                  .catch( error => console.log('INSERT ERROR:', error))
            }).catch( error => {
              console.log('FETCH RECIPIENT ERROR:', error);
            })
      }).catch( error => {
        console.log('FETCH AUTHOR ID ERROR', error);
      });
  })

  router.post( '/updateImportance', ( req, res ) => {
    const { messageId } = req.body;

    db.any( `UPDATE emails
      SET isimportant = NOT isimportant
      WHERE id = ${ messageId }` )
      .then( () => res.status( 200 ).send( 'Message was updated successfully' ) )
      .catch( error => {
        console.log( 'MARK AS IMPORTANT ERROR: ', error );

        res.status( 500 ).send( 'Something went wrong...Please try again' );
      })
  })

  router.post( '/deleteEmail', ( req, res ) => {
    const { messageId } = req.body;

    db.any( `DELETE FROM emails WHERE id=${ messageId }` )
      .then( () => res.status( 200 ).send( 'The message was deleted successfully' ) )
      .catch( error => {
        console.log( 'DELTE EMAIL ERROR: ', error );

        res.status( 500 ).send( 'Something went wrong...Please try again' );
      });
  })

  return router;
}

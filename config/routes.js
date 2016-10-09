'use strict';

/*!
 * Module dependencies.
 */

// Note: We can require users, playlists and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

const users = require('../app/controllers/users');
const playlists = require('../app/controllers/playlists');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const playlistAuth = [auth.requiresLogin, auth.playlist.hasAuthorization];
// const videoAuth = [auth.requiresLogin, auth.video.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
//   app.get('/auth/facebook',
//     passport.authenticate('facebook', {
//       scope: [ 'email', 'user_about_me'],
//       failureRedirect: '/login'
//     }), users.signin);
//   app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//       failureRedirect: '/login'
//     }), users.authCallback);
//   app.get('/auth/github',
//     passport.authenticate('github', {
//       failureRedirect: '/login'
//     }), users.signin);
//   app.get('/auth/github/callback',
//     passport.authenticate('github', {
//       failureRedirect: '/login'
//     }), users.authCallback);
//   app.get('/auth/twitter',
//     passport.authenticate('twitter', {
//       failureRedirect: '/login'
//     }), users.signin);
//   app.get('/auth/twitter/callback',
//     passport.authenticate('twitter', {
//       failureRedirect: '/login'
//     }), users.authCallback);
//   app.get('/auth/google',
//     passport.authenticate('google', {
//       failureRedirect: '/login',
//       scope: [
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email'
//       ]
//     }), users.signin);
//   app.get('/auth/google/callback',
//     passport.authenticate('google', {
//       failureRedirect: '/login'
//     }), users.authCallback);
//   app.get('/auth/linkedin',
//     passport.authenticate('linkedin', {
//       failureRedirect: '/login',
//       scope: [
//         'r_emailaddress'
//       ]
//     }), users.signin);
//   app.get('/auth/linkedin/callback',
//     passport.authenticate('linkedin', {
//       failureRedirect: '/login'
//     }), users.authCallback);

  app.param('userId', users.load);

  // playlist routes
  app.param('id', playlists.load);
  app.get('/playlists', playlists.index);
  app.get('/playlists/new', auth.requiresLogin, playlists.new);
  app.post('/playlists', auth.requiresLogin, playlists.create);
  app.get('/playlists/:id', playlists.show);
  app.get('/playlists/:id/edit', playlistAuth, playlists.edit);
  app.put('/playlists/:id', playlistAuth, playlists.update);
  app.delete('/playlists/:id', playlistAuth, playlists.destroy);

  // home route
  app.get('/', playlists.index);

  // videos routes
  // app.post('/playlists/:id/videos', auth.requiresLogin, playlists.addVideo);
  // app.delete('/playlists/:id/vidoes/:videoId', playlistAuth, playlists.removeVideo);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};

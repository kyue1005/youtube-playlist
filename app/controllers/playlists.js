'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const assign = require('object-assign');
const wrap = require('co-express');
const only = require('only');
const Playlist = mongoose.model('Playlist');

/**
 * Load
 */

exports.load = wrap(function* (req, res, next, _id) {
  req.playlist = yield Playlist.load(_id);
  if (!req.playlist) return next(new Error('Playlist not found'));
  next();
});

/**
 * List
 */

exports.index = wrap(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  const playlists = yield Playlist.list(options);
  const count = yield Playlist.count();

  res.render('playlists/index', {
    title: 'Playlists',
    playlists: playlists,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

/**
 * New Playlists
 */

exports.new = function (req, res){
  res.render('playlists/new', {
    title: 'New Playlist',
    playlist: new Playlist()
  });
};

/**
 * Create an playlist
 */

exports.create = wrap(function* (req, res) {
  const playlist = new Playlist(only(req.body, 'title description'));
  playlist.user = req.user;
  try {
    yield playlist.save();
    res.redirect('/playlists/' + playlist._id);
  } catch (err) {
    res.redirect('/playlists/new', 422);
  }
});

/**
 * Show
 */

exports.show = function (req, res){
  res.render('playlists/show', {
    title: req.playlist.title,
    playlist: req.playlist
  });
};

/**
 * Edit an playlist
 */

exports.edit = function (req, res) {
  res.render('playlists/edit', {
    title: 'Edit ' + req.playlist.title,
    playlist: req.playlist
  });
};

/**
 * Update playlist
 */

exports.update = wrap(function* (req, res) {
  const playlist = req.playlist;
  console.log(req.body);
  assign(playlist, only(req.body, 'title description'));
  try {
    yield playlist.save();
    res.redirect('/playlists/' + playlist._id);
  } catch (err) {
    res.redirect('/playlists/edit', 422);
  }
});


/**
 * Delete an playlist
 */

exports.destroy = wrap(function* (req, res) {
  yield req.playlist.remove();
  req.flash('info', 'Deleted successfully');
});

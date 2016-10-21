'use strict';

/**
 * Module dependencies.
 */

const wrap = require('co-express');

/**
 * Load
 */

exports.load = function (req, res, next, _id) {
  req.video = req.playlist.videos
    .find(video => video.id === _id);

  if (!req.video) return next(new Error('Video not found'));
  next();
};

/**
 * Create video
 */

exports.create = wrap(function* (req, res) {
  const playlist = req.playlist;
  const success = yield playlist.addVideo(req.body);
  console.log(playlist.videos);
  if (Array.isArray(success) && success[0] === false) {
    res.send(500, 'Duplicated video!');
  } else {
    res.render('videos/video', {
      playlist: playlist,
      video: playlist.videos[playlist.videos.length-1],
      index: playlist.videos.length-1,
      layout: 'clean'
    });
  }
});

/**
 * Delete video
 */

exports.destroy = wrap(function* (req, res) {
  const success = yield req.playlist.removeVideo(req.params.videoId);

  if (success) {
    res.send(200, 'Removed Video - ' + req.video.title);
  } else {
    res.send(500, 'Video not exist!');
  }
});
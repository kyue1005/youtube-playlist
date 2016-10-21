'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Playlist Schema
 */

const PlaylistSchema = new Schema({
  title: { type : String, default : '', trim : true },
  description: { type : String, default : '', trim : true },
  user: { type : Schema.ObjectId, ref : 'User' },
  videos: [{
    title: { type : String, default : '', trim : true },
    yt_id: { type : String, default : '', trim : true },
    duration: { type : String, default : '', trim : true }
  }],
  createdAt  : { type : Date, default : Date.now }
});

/**
 * Validations
 */

PlaylistSchema.path('title').required(true, 'Playlist title cannot be blank');
PlaylistSchema.path('description').required(true, 'Playlist description cannot be blank');

/**
 * Methods
 */

PlaylistSchema.methods = {
  
  /**
   * Add comment
   *
   * @param {Object} video
   * @api private
   */
  addVideo: function (video) {
    // Check duplication
    const target = this.videos
      .map(video => video.yt_id)
      .indexOf(video.yt_id);
    if (~target) return [false];
    
    this.videos.push({
      title: video.title,
      yt_id: video.yt_id,
      duration: video.duration,
    });

    return this.save();
  },
  
  /**
   * Remove video
   *
   * @param {String} videoId
   * @api private
   */

  removeVideo: function (videoId) {
    const index = this.videos
      .map(video => video.id)
      .indexOf(videoId);

    if (~index) this.videos.splice(index, 1);
    else throw new Error('Video not found');
    return this.save();
  }
}

/**
 * Statics
 */

PlaylistSchema.statics = {

  /**
   * Find playlist by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      .populate('user', 'name email username')
      .exec();
  },

  /**
   * List playlists
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 10;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};


mongoose.model('Playlist', PlaylistSchema);
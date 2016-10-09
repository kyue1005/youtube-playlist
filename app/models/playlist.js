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
  videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
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
  },
  
  /**
   * List playlist's video
   *
   * @param {Object} options
   * @api private
   */

  listVideo: function (_id) {
    return this.findOne({ _id })
      .populate('videos')
      .exec();
  }
};


mongoose.model('Playlist', PlaylistSchema);
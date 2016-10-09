'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**
 * Video Schema
 */

const VideoSchema = new Schema({
  title: { type : String, default : '', trim : true },
  yt_id: { type : String, default : '', trim : true },
});

/**
 * Validations
 */

VideoSchema.path('title').required(true, 'Video title cannot be blank');
VideoSchema.path('yt_id').required(true, 'Video youtube ID cannot be blank');


mongoose.model('Video', VideoSchema);
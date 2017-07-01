/**
 * RedditController
 *
 * @description :: Server-side logic for managing reddits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var RedditStream, post_stream;
RedditStream = require('reddit-stream');

module.exports = {

	home: function(req, res) {
		var subreddit = req.param('subreddit');
		var socket = req.socket;
		var io = sails.io;
    async.series([
      function(callback) {
				post_stream = new RedditStream('posts', subreddit, 'unique user agent for my-supercool-bot');

		    post_stream.start();

		    post_stream.on('new', function(post) {
		      var postObj = {
		        title: post[0].data.title,
		        link: post[0].data.url,
		      }
		      sails.sockets.blast("post", postObj);					
		    });
        callback();
      },
    ], function(callback) {
      res.view('reddit/home', {
      });
    });
  },

};

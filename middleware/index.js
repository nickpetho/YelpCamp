var middlewareObj = {},
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	// is user logged in
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				res.redirect('back');
			} else {
				// does user own campground?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	// is user logged in
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				// does user own comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	//req.flash('success', 'Please login first!');
	res.redirect('/login');
};

module.exports = middlewareObj;

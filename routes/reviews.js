const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Venue = require('../models/venue');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    venue.reviews.push(review);
    await review.save();
    await venue.save();
    req.flash('succes', 'Created new review!');
    res.redirect(`/venues/${venue._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Venue.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/venues/${id}`);
}))

module.exports = router;
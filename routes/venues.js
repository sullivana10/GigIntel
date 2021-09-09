const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateVenue } = require('../middleware');

const Venue = require('../models/venue');

router.get('/', catchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render('venues/index', { venues });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('venues/new');
})

router.get('/:id/equipment', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipment', { venue });
}))
router.get('/:id/greenRoom', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoom', { venue });
}));
router.get('/:id/parking', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parking', { venue });
}));
router.get('/:id/food', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/food', { venue });
}));

router.post('/', isLoggedIn, validateVenue, catchAsync(async (req, res, next) => {
    const venue = new Venue(req.body.venue);
    venue.author = req.user._id;
    await venue.save();
    req.flash('success', 'Successfully made a new venue!')
    res.redirect(`/venues/${venue._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!venue) {
        req.flash('error', 'Cannot find that venue!')
        return res.redirect('/venues');
    }
    res.render('venues/show', { venue });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id)
    if (!venue) {
        req.flash('error', 'Cannot find that venue!')
        res.redirect('/venues');
    }
    res.render('venues/edit', { venue });
}));
router.get('/:id/equipmentEdit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipmentEdit', { venue });
}));
router.get('/:id/greenRoomEdit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoomEdit', { venue });
}));
router.get('/:id/parkingEdit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parkingEdit', { venue });
}));
router.get('/:id/foodEdit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/foodEdit', { venue });
}));

router.put('/:id', isLoggedIn, isAuthor, validateVenue, catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
    req.flash('success', 'Successfully updated venue!');
    res.redirect(`/venues/${venue._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted venue!');
    res.redirect('/venues');
}));

module.exports = router;
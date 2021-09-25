const express = require('express');
const router = express.Router();
const venues = require('../controllers/venues');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateVenue } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Venue = require('../models/venue');

router.route('/')
    .get(catchAsync(venues.index))
    .post(isLoggedIn, upload.array('image'), validateVenue, catchAsync(venues.createVenue));

router.get('/new', isLoggedIn, venues.renderNewForm);

router.route('/:id')
    .get(catchAsync(venues.showVenue))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(venues.updateVenue))
    .delete(isLoggedIn, isAuthor, catchAsync(venues.deleteVenue));

router.get('/:id/equipment', catchAsync(venues.equipment))

router.get('/:id/greenRoom', catchAsync(venues.greenRoom));

router.get('/:id/parking', catchAsync(venues.parking));

router.get('/:id/food', catchAsync(venues.food));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(venues.renderEditForm));

router.get('/:id/equipmentEdit', isLoggedIn, isAuthor, catchAsync(venues.equipmentEdit));

router.get('/:id/greenRoomEdit', isLoggedIn, isAuthor, catchAsync(venues.greenRoomEdit));

router.get('/:id/parkingEdit', isLoggedIn, isAuthor, catchAsync(venues.parkingEdit));

router.get('/:id/foodEdit', isLoggedIn, isAuthor, catchAsync(venues.foodEdit));

module.exports = router;
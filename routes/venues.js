const express = require('express');
const router = express.Router();
const venues = require('../controllers/venues');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateVenue } = require('../middleware');

const Venue = require('../models/venue');

router.get('/', catchAsync(venues.index));

router.get('/new', isLoggedIn, venues.renderNewForm);

router.get('/:id/equipment', catchAsync(venues.equipment))

router.get('/:id/greenRoom', catchAsync(venues.greenRoom));

router.get('/:id/parking', catchAsync(venues.parking));

router.get('/:id/food', catchAsync(venues.food));

router.post('/', isLoggedIn, validateVenue, catchAsync(venues.createVenue));

router.get('/:id', catchAsync(venues.showVenue));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(venues.renderEditForm));

router.get('/:id/equipmentEdit', isLoggedIn, isAuthor, catchAsync(venues.equipmentEdit));

router.get('/:id/greenRoomEdit', isLoggedIn, isAuthor, catchAsync(venues.greenRoomEdit));

router.get('/:id/parkingEdit', isLoggedIn, isAuthor, catchAsync(venues.parkingEdit));

router.get('/:id/foodEdit', isLoggedIn, isAuthor, catchAsync(venues.foodEdit));

router.put('/:id', isLoggedIn, isAuthor, validateVenue, catchAsync(venues.updateVenue));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(venues.deleteVenue));

module.exports = router;
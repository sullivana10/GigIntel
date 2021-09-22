const Venue = require('../models/venue');

module.exports.index = async (req, res) => {
    const venues = await Venue.find({});
    res.render('venues/index', { venues });
}

module.exports.renderNewForm = (req, res) => {
    res.render('venues/new');
}

module.exports.equipment = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipment', { venue });
}

module.exports.greenRoom = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoom', { venue });
}

module.exports.parking = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parking', { venue });
}

module.exports.food = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/food', { venue });
}

module.exports.createVenue = async (req, res, next) => {
    const venue = new Venue(req.body.venue);
    venue.author = req.user._id;
    await venue.save();
    req.flash('success', 'Successfully made a new venue!')
    res.redirect(`/venues/${venue._id}`)
}

module.exports.showVenue = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id)
    if (!venue) {
        req.flash('error', 'Cannot find that venue!')
        res.redirect('/venues');
    }
    res.render('venues/edit', { venue });
}

module.exports.equipmentEdit = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipmentEdit', { venue });
}

module.exports.greenRoomEdit = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoomEdit', { venue });
}

module.exports.parkingEdit = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parkingEdit', { venue });
}

module.exports.foodEdit = async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/foodEdit', { venue });
}

module.exports.updateVenue = async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
    req.flash('success', 'Successfully updated venue!');
    res.redirect(`/venues/${venue._id}`)
}

module.exports.deleteVenue = async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted venue!');
    res.redirect('/venues');
}
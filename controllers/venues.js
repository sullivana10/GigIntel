const Venue = require('../models/venue');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.venue.location,
        limit: 1
    }).send()
    const venue = new Venue(req.body.venue);
    venue.geometry = geoData.body.features[0].geometry;
    venue.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    venue.images.push(...imgs);
    await venue.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await venue.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated venue!');
    res.redirect(`/venues/${venue._id}`)
}

module.exports.deleteVenue = async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted venue!');
    res.redirect('/venues');
}
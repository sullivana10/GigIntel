const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueSchema = new Schema({
    title: String,
    image: String,
    equipmentImage: String,
    greenRoomImage: String,
    parkingImage: String,
    foodImage: String,
    description: String,
    location: String,
    equipment: String,
    greenRoom: String,
    parking: String,
    food: String,
});

module.exports = mongoose.model('Venue', VenueSchema);
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

VenueSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Venue', VenueSchema);
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const VenueSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
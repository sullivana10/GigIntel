const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Venue = require('../models/venue');

mongoose.connect('mongodb://localhost:27017/venue', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Venue.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const ven = new Venue({
            author: '613a56c04936fd1da4f9bd40',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
            images: [
                {
                    url: 'https://res.cloudinary.com/sullivana10/image/upload/v1632340100/GigIntel/tyrrpomrza3bb1omulua.jpg',
                    filename: 'GigIntel/tyrrpomrza3bb1omulua'
                },
                {
                    url: 'https://res.cloudinary.com/sullivana10/image/upload/v1632334305/GigIntel/por8owvvx8xsuyyr13ky.jpg',
                    filename: 'GigIntel/por8owvvx8xsuyyr13ky'

                }
            ]
        })
        await ven.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
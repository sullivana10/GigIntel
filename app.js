const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { venueSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Venue = require('./models/venue');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/venue', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateVenue = (req, res, next) => {
    const { error } = venueSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/venues', catchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render('venues/index', { venues });
}));

app.get('/venues/new', (req, res) => {
    res.render('venues/new');
})

app.get('/venues/:id/equipment', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipment', { venue });
}))
app.get('/venues/:id/greenRoom', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoom', { venue });
}));
app.get('/venues/:id/parking', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parking', { venue });
}));
app.get('/venues/:id/food', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/food', { venue });
}));

app.post('/venues', validateVenue, catchAsync(async (req, res, next) => {
    //if (!req.body.venue) throw new ExpressError('Invalid Venue Data', 400);
    const venue = new Venue(req.body.venue);
    await venue.save();
    res.redirect(`/venues/${venue._id}`)
}));

app.get('/venues/:id', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id).populate('reviews');
    res.render('venues/show', { venue });
}));

app.get('/venues/:id/edit', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/edit', { venue });
}));
app.get('/venues/:id/equipmentEdit', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipmentEdit', { venue });
}));
app.get('/venues/:id/greenRoomEdit', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoomEdit', { venue });
}));
app.get('/venues/:id/parkingEdit', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parkingEdit', { venue });
}));
app.get('/venues/:id/foodEdit', catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/foodEdit', { venue });
}));

app.put('/venues/:id', validateVenue, catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
    res.redirect(`/venues/${venue._id}`)
}));

app.post('/venues/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const venue = await Venue.findById(req.params.id);
    const review = new Review(req.body.review);
    venue.reviews.push(review);
    await review.save();
    await venue.save();
    res.redirect(`/venues/${venue._id}`);
}))

app.delete('/venues/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Venue.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/venues/${id}`);
}))

app.delete('/venues/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    res.redirect('/venues');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
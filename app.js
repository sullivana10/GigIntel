const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Venue = require('./models/venue');

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

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/venues', async (req, res) => {
    const venues = await Venue.find({});
    res.render('venues/index', { venues });
});

app.get('/venues/new', (req, res) => {
    res.render('venues/new');
})

app.get('/venues/:id/equipment', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipment', { venue });
})
app.get('/venues/:id/greenRoom', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/greenRoom', { venue });
})
app.get('/venues/:id/parking', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/parking', { venue });
})
app.get('/venues/:id/food', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/food', { venue });
})

app.post('/venues', async (req, res) => {
    const venue = new Venue(req.body.venue);
    await venue.save();
    res.redirect(`/venues/${venue._id}`)
})

app.get('/venues/:id', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/show', { venue });
});

app.get('/venues/:id/edit', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/edit', { venue });
})
app.get('/venues/:id/equipmentEdit', async (req, res) => {
    const venue = await Venue.findById(req.params.id)
    res.render('venues/equipmentEdit', { venue });
})

app.put('/venues/:id', async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
    res.redirect(`/venues/${venue._id}`)
})

app.delete('/venues/:id', async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    res.redirect('/venues');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
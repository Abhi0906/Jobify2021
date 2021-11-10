const mongoose = require('mongoose');
const Job = require('../models/job');
const cities = require('./cities');
const { places, descriptors, companies } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/jobSite');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Job.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const job = new Job({
            author: '6185177f59b914b9d813af5a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            company: `${sample(companies)} `,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dsr42urky/image/upload/v1636279524/JobSite/vcjoki1p85mdx4xuwhf8.jpg',
                    filename: 'JobSite/vcjoki1p85mdx4xuwhf8',
                }
            ],
            description: 'abcaskjfhb ksehf gefhgbahjbafkhcavblcjhavdlcua jah gakydfva,jh ay gafkhjayg kyig kyg kjyhfgvjgh'
        })
        await job.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
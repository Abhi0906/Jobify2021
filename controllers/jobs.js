const Job = require('../models/job');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const jobs = await Job.find({});
    res.render('jobs/index', { jobs });
}

module.exports.renderNewForm = (req, res) => {
    res.render('jobs/new');
}

module.exports.createJob = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.job.location,
        limit: 1
    }).send()
    const job = new Job(req.body.job);
    job.geometry = geoData.body.features[0].geometry;
    job.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    job.author = req.user._id;
    await job.save();
    req.flash('success', 'Successfully added a new Job!');
    res.redirect(`/jobs/${job._id}`);
}

module.exports.showJob = async (req, res) => {
    const job = await Job.findById(req.params.id).populate({
        path: 'applications',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!job) {
        req.flash('error', 'Cannot find the Job!')
        return res.redirect('/jobs');
    }
    res.render('jobs/show', { job });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        req.flash('error', 'Cannot find the Job!')
        return res.redirect('/jobs');
    }
    res.render('jobs/edit', { job });
}

module.exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, { ...req.body.job });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    job.images.push(...imgs);
    await job.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await job.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated the Job!');
    res.redirect(`/jobs/${job._id}`);
}

module.exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Job!');
    res.redirect('/jobs');
}
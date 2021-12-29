const { jobSchema, applySchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Job = require('./models/job');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Logged In!');
        return res.redirect('/login')
    }
    next()
}
module.exports.validateJob = (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/jobs/${id}`);
    }
    next();
};

module.exports.validateApplication = (req, res, next) => {
    const { error } = applySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
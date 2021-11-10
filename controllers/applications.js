const Job = require('../models/job');
const Apply = require('../models/apply');

module.exports.addApplication = async (req, res) => {
    const job = await Job.findById(req.params.id);
    const apply = new Apply(req.body.apply);
    apply.author = req.user._id;
    job.applications.push(apply);
    await apply.save();
    await job.save();
    req.flash('success', 'Successfully added your Application!');
    res.redirect(`/jobs/${job._id}`);
}

module.exports.deleteApplication = async (req, res) => {
    const { id, applicationId } = req.params;
    await Job.findByIdAndUpdate(id, { $pull: { applications: applicationId } });
    await Apply.findByIdAndDelete(applicationId);
    req.flash('success', 'Successfully deleted the Application!');
    res.redirect(`/jobs/${id}`);
}
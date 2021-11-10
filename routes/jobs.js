const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const jobs = require('../controllers/jobs');
const Job = require('../models/job');
const { isLoggedIn, isAuthor, validateJob } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(jobs.index))
    .post(isLoggedIn, upload.array('image'), validateJob, catchAsync(jobs.createJob))


router.get('/new', isLoggedIn, jobs.renderNewForm);

router.route('/:id')
    .get(catchAsync(jobs.showJob))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateJob, catchAsync(jobs.updateJob))
    .delete(isLoggedIn, isAuthor, catchAsync(jobs.deleteJob))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(jobs.renderEditForm));

module.exports = router;
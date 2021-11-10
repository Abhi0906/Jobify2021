const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateApplication, isLoggedIn } = require('../middleware')
const applications = require('../controllers/applications');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateApplication, catchAsync(applications.addApplication));

router.delete('/:applicationId', isLoggedIn, catchAsync(applications.deleteApplication));

module.exports = router;
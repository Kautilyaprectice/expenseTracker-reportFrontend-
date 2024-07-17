const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');
const userAuthentication = require('../middleware/authenticate');

router.get('/premium/leaderboard', userAuthentication.authenticate, premiumController.getUserLeaderboard);

module.exports = router;
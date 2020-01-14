const express = require('express');
const router = express.Router();
const { getTestPage } = require('../../controllers/v1/test');

router.get('/', getTestPage);

module.exports = router;

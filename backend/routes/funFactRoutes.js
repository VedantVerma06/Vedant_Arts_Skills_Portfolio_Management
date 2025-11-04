// routes/funFactRoutes.js
const express = require('express');
const { getFunFacts, addFunFact, deleteFunFact } = require('../controllers/funFactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFunFacts);
router.post('/', protect, adminOnly, addFunFact);
router.delete('/:id', protect, adminOnly, deleteFunFact);

module.exports = router;

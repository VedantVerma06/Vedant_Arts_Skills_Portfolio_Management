// controllers/funFactController.js
const FunFact = require('../models/FunFact');

exports.getFunFacts = async (req, res) => {
  try {
    const facts = await FunFact.find().sort({ createdAt: -1 }).limit(20);
    res.json(facts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFunFact = async (req, res) => {
  try {
    const { fact } = req.body;
    if (!fact) return res.status(400).json({ message: 'Fact is required' });
    const ff = await FunFact.create({ fact, addedBy: req.user.id });
    res.status(201).json(ff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFunFact = async (req, res) => {
  try {
    const ff = await FunFact.findById(req.params.id);
    if (!ff) return res.status(404).json({ message: 'Not found' });
    await ff.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

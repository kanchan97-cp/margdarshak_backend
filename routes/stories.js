const express = require('express');
const Story = require('../models/Story');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
    try {
        const story = new Story(req.body);
        await story.save();
        res.status(201).json(story);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ (with Pagination, Search, Sort)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ]
        };

        // Add Filters
        if (req.query.role) {
            query.role = req.query.role;
        }

        const stories = await Story.find(query)
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Story.countDocuments(query);

        res.json({
            data: stories,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!story) return res.status(404).json({ error: 'Story not found' });
        res.json(story);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ error: 'Story not found' });
        res.json({ message: 'Story deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

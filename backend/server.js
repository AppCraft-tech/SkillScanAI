require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all interviews
app.get('/api/interviews', async (req, res) => {
    try {
        const interviews = await prisma.interviewSession.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const formattedInterviews = interviews.map(i => ({
            ...i,
            questions: JSON.parse(i.questions),
            answers: JSON.parse(i.answers),
            evaluations: JSON.parse(i.evaluations),
            suggestions: JSON.parse(i.suggestions)
        }));
        res.json(formattedInterviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch interviews' });
    }
});

// Save a new interview
app.post('/api/interviews', async (req, res) => {
    try {
        const data = req.body;
        const newInterview = await prisma.interviewSession.create({
            data: {
                userName: data.userName,
                role: data.role,
                date: data.date,
                score: data.score,
                numericScore: data.numericScore,
                status: data.status,
                confidence: data.confidence,
                communication: data.communication,
                technical: data.technical,
                questions: JSON.stringify(data.questions || []),
                answers: JSON.stringify(data.answers || []),
                evaluations: JSON.stringify(data.evaluations || []),
                suggestions: JSON.stringify(data.suggestions || []),
                isResumeBased: data.isResumeBased || false,
                resumeScore: data.resumeScore || null,
                resumeStatus: data.resumeStatus || null
            }
        });
        res.status(201).json({
            ...newInterview,
            questions: JSON.parse(newInterview.questions),
            answers: JSON.parse(newInterview.answers),
            evaluations: JSON.parse(newInterview.evaluations),
            suggestions: JSON.parse(newInterview.suggestions)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save interview' });
    }
});

// Clear all history
app.delete('/api/interviews', async (req, res) => {
    try {
        await prisma.interviewSession.deleteMany({});
        res.json({ message: 'All history cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

// Delete a specific interview
app.delete('/api/interviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.interviewSession.delete({
            where: { id: parseInt(id, 10) }
        });
        res.json({ message: 'Interview deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete interview' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

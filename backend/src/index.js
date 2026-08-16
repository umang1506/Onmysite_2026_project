import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';
import triageRouter from './routes/triage.js';
import replayRouter from './routes/replay.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRouter);
app.use('/triage', triageRouter);
app.use('/replay', replayRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Onmysite Triage Engine', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Onmysite Clinical Triage Backend running on http://localhost:${PORT}`);
  });
}

export default app;

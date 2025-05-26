import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Demo data
const users = [{ username: 'admin', password: 'test1234' }];

const processes = [
  { id: 1, name: 'Casting' },
  { id: 2, name: 'Sprue cutting' },
  { id: 3, name: 'Heat treatment' },
  { id: 4, name: 'Machining' },
  { id: 5, name: 'Design cutting' },
  { id: 6, name: 'Flow forming' }
];

const machines = [
  // Casting: LPDC 1 to 36
  ...Array.from({ length: 36 }, (_, i) => ({ 
    id: i + 1, 
    name: `LPDC ${i + 1}`, 
    process_id: 1, 
    status: 'working' 
  })),
  // Sprue cutting: 01 to 06
  ...Array.from({ length: 6 }, (_, i) => ({ 
    id: 36 + i + 1, 
    name: `Sprue cutting ${String(i + 1).padStart(2, '0')}`, 
    process_id: 2, 
    status: 'working' 
  })),
  // Heat treatment: 01 to 04
  ...Array.from({ length: 4 }, (_, i) => ({ 
    id: 42 + i + 1, 
    name: `Heat treatment ${String(i + 1).padStart(2, '0')}`, 
    process_id: 3, 
    status: 'working' 
  })),
  // Machining: 01 to 26
  ...Array.from({ length: 26 }, (_, i) => ({ 
    id: 46 + i + 1, 
    name: `Machining ${String(i + 1).padStart(2, '0')}`, 
    process_id: 4, 
    status: 'working' 
  })),
  // Design cutting: 00 to 17
  ...Array.from({ length: 18 }, (_, i) => ({ 
    id: 72 + i + 1, 
    name: `Design cutting ${String(i).padStart(2, '0')}`, 
    process_id: 5, 
    status: 'working' 
  })),
  // Flow forming: 01 to 04
  ...Array.from({ length: 4 }, (_, i) => ({ 
    id: 90 + i + 1, 
    name: `Flow forming ${String(i + 1).padStart(2, '0')}`, 
    process_id: 6, 
    status: 'working' 
  }))
];

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ token: 'fake-jwt-token' });
});

app.get('/api/processes', (req, res) => {
  res.json(processes);
});

app.get('/api/machines', (req, res) => {
  const { processId } = req.query;
  const filtered = machines.filter(m => m.process_id === parseInt(processId));
  res.json(filtered);
});

app.put('/api/machines/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const machine = machines.find(m => m.id === parseInt(id));
  
  if (!machine) {
    return res.status(404).json({ message: 'Machine not found' });
  }

  machine.status = status;
  res.json(machine);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Access the API at http://localhost:${port} or http://YOUR_IP:${port}`);
}); 
import express from 'express';
import cors from 'cors';
import os from 'os';

const app = express();

// Configure CORS to accept requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

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

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  next();
};

// Routes
app.post('/api/auth/login', validateLoginInput, (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real application, you would generate a proper JWT token here
  res.json({ token: 'fake-jwt-token' });
});

app.get('/api/processes', (req, res) => {
  res.json(processes);
});

app.get('/api/machines', (req, res) => {
  const { processId } = req.query;
  
  if (!processId) {
    return res.status(400).json({ message: 'Process ID is required' });
  }

  const processIdNum = parseInt(processId);
  if (isNaN(processIdNum)) {
    return res.status(400).json({ message: 'Invalid process ID' });
  }

  const filtered = machines.filter(m => m.process_id === processIdNum);
  res.json(filtered);
});

app.put('/api/machines/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['working', 'maintenance', 'stopped'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const machineId = parseInt(id);
  if (isNaN(machineId)) {
    return res.status(400).json({ message: 'Invalid machine ID' });
  }

  const machine = machines.find(m => m.id === machineId);
  if (!machine) {
    return res.status(404).json({ message: 'Machine not found' });
  }

  machine.status = status;
  res.json(machine);
});

// Server info endpoint
app.get('/api/server-info', (req, res) => {
  res.json({
    ip: getLocalIP(),
    port: process.env.PORT || 5000,
    hostname: os.hostname()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server running on:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://${localIP}:${PORT}`);
}); 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MachineCard from './MachineCard';

const API_URL = 'http://192.168.11.111:5000';

export default function MachinesList({ processId }) {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/machines?processId=${processId}`)
      .then(res => setMachines(res.data));
  }, [processId]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 20 }}>
      {machines.map(machine => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
} 
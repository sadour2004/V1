import React, { useState, useEffect } from 'react';
import MenuProcess from '../components/MenuProcess';
import MachinesList from '../components/MachinesList';
import axios from 'axios';

const API_URL = 'http://192.168.11.111:5000';

export default function DashboardPage() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/processes`).then(res => setProcesses(res.data));
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <MenuProcess processes={processes} onSelect={setSelectedProcess} />
      {selectedProcess && <MachinesList processId={selectedProcess.id} />}
    </div>
  );
} 
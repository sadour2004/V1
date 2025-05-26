import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../config/api';

export default function DashboardScreen({ navigation }) {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    loadProcesses();
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      loadMachines(selectedProcess.id);
    }
  }, [selectedProcess]);

  const loadProcesses = async () => {
    try {
      const response = await api.get('/api/processes');
      setProcesses(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load processes');
    }
  };

  const loadMachines = async (processId) => {
    try {
      const response = await api.get(`/api/machines?processId=${processId}`);
      setMachines(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load machines');
    }
  };

  const updateMachineStatus = async (machineId, status) => {
    try {
      await api.put(`/api/machines/${machineId}/status`, { status });
      loadMachines(selectedProcess.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to update machine status');
    }
  };

  const renderMachine = ({ item }) => (
    <View style={[styles.machineCard, { borderColor: getStatusColor(item.status) }]}>
      <Text style={styles.machineName}>{item.name}</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, item.status === 'working' && styles.activeStatus]}
          onPress={() => updateMachineStatus(item.id, 'working')}
        >
          <Text style={styles.statusText}>Working</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, item.status === 'maintenance' && styles.activeStatus]}
          onPress={() => updateMachineStatus(item.id, 'maintenance')}
        >
          <Text style={styles.statusText}>Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, item.status === 'stop' && styles.activeStatus]}
          onPress={() => updateMachineStatus(item.id, 'stop')}
        >
          <Text style={styles.statusText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return '#4CAF50';
      case 'maintenance': return '#2196F3';
      case 'stop': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.processList}>
        <Text style={styles.sectionTitle}>Processes</Text>
        <FlatList
          data={processes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.processItem,
                selectedProcess?.id === item.id && styles.selectedProcess
              ]}
              onPress={() => setSelectedProcess(item)}
            >
              <Text style={styles.processName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.machineList}>
        <Text style={styles.sectionTitle}>Machines</Text>
        <FlatList
          data={machines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMachine}
          numColumns={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  processList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 10,
  },
  machineList: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  processItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedProcess: {
    backgroundColor: '#e3f2fd',
  },
  processName: {
    fontSize: 16,
  },
  machineCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
  },
  machineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  activeStatus: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    fontSize: 12,
  },
}); 
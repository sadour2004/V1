import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Default API URL that will be updated automatically
const DEFAULT_API_URL = 'http://192.168.11.111:5000';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [isDetectingServer, setIsDetectingServer] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualApiUrl, setManualApiUrl] = useState('');

  // Detect server on component mount and when network changes
  useEffect(() => {
    const detectServer = async () => {
      try {
        // Try to get server info from the default URL
        const response = await axios.get(`${DEFAULT_API_URL}/api/server-info`);
        setApiUrl(`http://${response.data.ip}:${response.data.port}`);
        setShowManualInput(false);
      } catch (error) {
        console.log('Could not detect server automatically');
        setShowManualInput(true);
      } finally {
        setIsDetectingServer(false);
      }
    };

    detectServer();

    // Add event listener for online/offline events
    window.addEventListener('online', detectServer);
    window.addEventListener('offline', () => {
      setError('Network connection lost. Please check your internet connection.');
    });

    return () => {
      window.removeEventListener('online', detectServer);
      window.removeEventListener('offline', () => {});
    };
  }, []);

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (manualApiUrl) {
      setApiUrl(manualApiUrl);
      setShowManualInput(false);
    }
  };

  const validateInputs = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('apiUrl', apiUrl); // Save API URL for other components
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your network connection.');
      } else {
        setError(err.response?.data?.message || 'Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isDetectingServer) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.title}>Detecting Server...</h2>
          <div style={styles.loading}>Please wait while we connect to the server</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        
        <div style={styles.serverInfo}>
          Server: {apiUrl}
          <button 
            type="button" 
            onClick={() => setShowManualInput(!showManualInput)}
            style={styles.toggleButton}
          >
            {showManualInput ? 'Hide' : 'Change'} Server
          </button>
        </div>

        {showManualInput && (
          <form onSubmit={handleManualUrlSubmit} style={styles.manualForm}>
            <input
              type="text"
              placeholder="Enter server URL (e.g., http://192.168.1.100:5000)"
              value={manualApiUrl}
              onChange={(e) => setManualApiUrl(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Set Server
            </button>
          </form>
        )}

        <input 
          placeholder="Username" 
          value={username} 
          onChange={e => {
            setUsername(e.target.value);
            setError('');
          }}
          style={styles.input}
          disabled={isLoading}
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => {
            setPassword(e.target.value);
            setError('');
          }}
          style={styles.input}
          disabled={isLoading}
        />

        <button 
          type="submit" 
          style={{
            ...styles.button,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#007AFF'
    }
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#0056b3'
    }
  },
  error: {
    marginTop: '1rem',
    color: '#dc3545',
    textAlign: 'center',
    fontSize: '0.9rem'
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    marginTop: '1rem'
  },
  serverInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  toggleButton: {
    marginLeft: '10px',
    padding: '4px 8px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  manualForm: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  }
}; 
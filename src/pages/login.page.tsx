/* eslint-disable no-console */
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'http://103-195-7-220.cloud-xip.com:1027/api/Auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await response.json();

      if (response.status === 200 && data) {
        login(data.token);
        navigate('/learn');

        console.log('Login successful');
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const inputStyle = {
    marginBottom: '1rem',
  };

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '350px',
        margin: 'auto',
      }}
    >
      <h1>Welcome to Lazy Voca</h1>
      <h3>Please login to continue</h3>
      <TextField
        label="User name"
        type="text"
        variant="outlined"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
        sx={{ input: { color: 'white' } }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        sx={{ input: { color: 'white' } }}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </form>
  );
}

export default Login;

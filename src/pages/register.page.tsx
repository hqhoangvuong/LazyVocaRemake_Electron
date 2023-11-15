import {
  Alert,
  AlertColor,
  Backdrop,
  Button,
  Snackbar,
  TextField,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');

  const [openAppNotify, setAppNotifyOpen] = React.useState<boolean>(false);
  const [appNotifyMsg, setAppNotifyMsg] = React.useState<string>('');
  const [appNotifySeverity, setAppNotifySeverity] =
    React.useState<AlertColor>();

  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAppNotifyClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setAppNotifyOpen(false);
  };

  const handleRegister = async () => {
    try {
      if (
        username === null ||
        username.trim().length === 0 ||
        password === null ||
        password.trim().length === 0 ||
        reenteredPassword === null ||
        reenteredPassword.trim().length === 0
      ) {
        setAppNotifyMsg('Username/Password is required.');
        setAppNotifySeverity('warning');
        return;
      }

      setLoading(true);

      // Check if passwords match
      if (password !== reenteredPassword) {
        setAppNotifyMsg('Passwords do not match.');
        setAppNotifySeverity('warning');
        setAppNotifyOpen(true);
        setLoading(false);
        return;
      }

      const response = await fetch(
        'http://103-195-7-220.cloud-xip.com:1027/api/Auth',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (response.status === 204) {
        const loginResponse = await fetch(
          'http://103-195-7-220.cloud-xip.com:1027/api/Auth',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          },
        );

        const loginData = await loginResponse.json();

        if (loginResponse.status === 200 && loginData) {
          login(loginData.token);
          navigate('/learn');
        }
      } else if (response.status === 409) {
        setAppNotifyMsg('Registration failed: Your username had been used');
        setAppNotifySeverity('warning');
      } else {
        setAppNotifyMsg('Registration failed');
        setAppNotifySeverity('warning');
      }
    } catch (error) {
      setAppNotifyMsg('An error occurred. Contact administrator');
      setAppNotifySeverity('error');
    } finally {
      setAppNotifyOpen(true);
      setLoading(false);
    }
  };

  const inputStyle = {
    marginBottom: '1rem',
    color: 'gray',
  };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '350px',
          margin: 'auto',
        }}
      >
        <Snackbar
          open={openAppNotify}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={handleAppNotifyClose}
        >
          <Alert
            onClose={handleAppNotifyClose}
            severity={appNotifySeverity}
            sx={{ width: '100%' }}
          >
            {appNotifyMsg}
          </Alert>
        </Snackbar>
        <h1 style={{ color: 'gray' }}>Register</h1>
        <TextField
          required
          label="User name"
          type="text"
          variant="outlined"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <TextField
          required
          label="Re-enter Password"
          type="password"
          variant="outlined"
          name="reenteredPassword"
          value={reenteredPassword}
          onChange={(e) => setReenteredPassword(e.target.value)}
          style={inputStyle}
        />
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>

        <div
          style={{
            display: 'flex',
            paddingTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link to="/">Or go back to login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;

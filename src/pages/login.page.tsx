/* eslint-disable no-console */
import {
  Alert,
  AlertColor,
  Backdrop,
  Button,
  Snackbar,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async () => {
    try {
      setLoading(true);
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
      } else {
        setAppNotifyMsg('Login failed');
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
            sx={{ width: '50%' }}
          >
            {appNotifyMsg}
          </Alert>
        </Snackbar>
        <h1>Welcome to Lazy Voca</h1>
        <TextField
          required
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
          required
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          sx={{
            input: { color: 'white' },
          }}
        />
        <FormControlLabel
          style={inputStyle}
          label="Keep me logged in"
          control={
            <Checkbox
              sx={{
                color: '#FFFFFF',
                '&.Mui-checked': {
                  color: '#FFFFFF',
                },
              }}
            />
          }
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h4>Or click here to sign in</h4>
        </div>
      </form>
    </div>
  );
}

export default Login;

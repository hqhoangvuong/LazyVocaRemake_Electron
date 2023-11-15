import {
  Alert,
  AlertColor,
  AlertTitle,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextareaAutosize,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

function Import() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);

  const [data, setData] = useState<string>('');

  const [openAppNotify, setAppNotifyOpen] = React.useState<boolean>(false);

  const [appNotifyMsg, setAppNotifyMsg] = React.useState<string>('');

  const [appNotifySeverity, setAppNotifySeverity] =
    React.useState<AlertColor>();

  const { token } = useAuth();

  const changeWindowSide = () => {
    window.electron.ipcRenderer.resizeWindowToImport();
  };

  const handleAppNotifyClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setAppNotifyOpen(false);
  };

  const cancelAndGoBack = () => {
    navigate('/learn');
    window.electron.ipcRenderer.resizeWindowToLearn();
  };

  const handleImportWords = async () => {
    setLoading(true);

    const response = await fetch(
      'http://103-195-7-220.cloud-xip.com:1027/api/Vocabulary',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      },
    );

    const importData = await response.json();

    if (response.status === 200 && importData) {
      setAppNotifySeverity(
        importData.inserted + importData.updated !== 0 ? 'success' : 'warning',
      );

      setAppNotifyMsg(
        `${importData.inserted} inserted; ${importData.updated} updated; ${
          importData.inserted + importData.updated !== 0 ? 0 : 1
        } error(s).`,
      );
    } else {
      setAppNotifySeverity('error');
      setAppNotifyMsg('Import failed, please contact administrator');
    }

    setAppNotifyOpen(true);
    setLoading(false);
  };

  changeWindowSide();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '750px',
        minHeight: '550px',
        margin: 'auto',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openAppNotify}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleAppNotifyClose}
      >
        <Alert
          onClose={handleAppNotifyClose}
          variant="filled"
          severity={appNotifySeverity}
          sx={{ width: '100%' }}
        >
           <AlertTitle>Import result:</AlertTitle>
          {appNotifyMsg}
        </Alert>
      </Snackbar>
      <Box sx={{ m: 1 }}>
        <h1 style={{ color: 'gray' }}>Import new word(s)</h1>
        <TextareaAutosize
          aria-label="empty textarea"
          minRows={25}
          maxRows={25}
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter text here"
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button variant="contained" color="success" onClick={handleImportWords}>
          Import Vocabulary
        </Button>
        <Button variant="contained" color="error" onClick={cancelAndGoBack}>
          Cancel
        </Button>
      </Box>
    </div>
  );
}

export default Import;

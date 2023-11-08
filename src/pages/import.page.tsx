import { Box, Button, TextField, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Import() {
  const navigate = useNavigate();

  const changeWindowSide = () => {
    window.electron.ipcRenderer.resizeWindowToImport();
  };

  const cancelAndGoBack = () => {
    navigate('/learn');
    window.electron.ipcRenderer.resizeWindowToLearn();
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
      <Box sx={{ m: 1 }}>
        <h1>Import new word(s)</h1>
        <TextareaAutosize
          aria-label="empty textarea"
          minRows={25}
          maxRows={25}
          placeholder="Enter your text here"
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button variant="contained" color="success">
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

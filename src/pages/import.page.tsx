import { Box, Button, TextField } from '@mui/material';
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
    <div>
      <Box>
        <TextField />
      </Box>
      <Box sx={{ '& button': { m: 1 } }}>
        <h1>Import new word(s)</h1>
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

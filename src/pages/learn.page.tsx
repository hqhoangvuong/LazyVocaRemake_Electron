/* eslint-disable promise/always-return */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Popover,
  Rating,
  Snackbar,
  Typography,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SettingsIcon from '@mui/icons-material/Settings';
import PublishIcon from '@mui/icons-material/Publish';
import Speech from 'speak-tts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

import './learn.page.css';

const speech = new Speech();

speech
  .init({
    volume: 1,
    lang: 'en-GB',
    rate: 0.9,
    voice: 'Microsoft Susan - English (United Kingdom)',
    pitch: 1,
    splitSentences: true,
    listeners: {
      onvoiceschanged: (voices: string) => {
        console.log('Event voiceschanged', voices);
      },
    },
  })
  .then((data: any) => {
    console.log('Speech is ready, voices are available', data);
  })
  .catch((e: any) => {
    console.error('An error occured while initializing : ', e);
  });

function Learn() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const [muted, setMuted] = useState<boolean>(false);

  const [appNotifyOpen, setAppNotifyOpen] = React.useState<boolean>(false);

  const [word, setWord] = useState<string>('');
  const [ipa, setIpa] = useState<string>('');
  const [meaning, setMeaning] = useState<string>('');
  const [examples, setExamples] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [complexity, setComplexcity] = useState<number>(0);
  const [moveNext, setMoveNext] = useState<number>(0);

  const { token } = useAuth();

  const toggleMute = () => {
    setMuted(!muted);
    if (!muted) {
      speech.cancel();
      speech.setVolume(0.1);
    } else {
      speech.setVolume(1);
    }
  };

  const importNavigate = () => {
    navigate('/import');
  };

  const fetchData = async () => {
    console.log('Fetching data');
    try {
      const response = await axios.get(
        'http://103-195-7-220.cloud-xip.com:1027/api/Vocabulary',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setWord(response.data.word);
        setIpa(response.data.ipa);
        setMeaning(response.data.meaning);
        setExamples(response.data.example);
        setTranslate(response.data.translation);
        setComplexcity(response.data.complexity);

        await speech.speak({
          text: `Word: ${response.data.word}. Meaning: ${response.data.meaning}. Examples: ${response.data.example}`,
          queue: false,
          listeners: {
            onstart: () => {},
            onend: () => {},
          },
        });

        console.log('End of fetch');
        setMoveNext(moveNext + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEasinessEditOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEasinessEditClose = () => {
    setAnchorEl(null);
  };

  const updateEasiness = (newValue: number) => {
    console.log(newValue);
    // call API here

    setAppNotifyOpen(true);
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

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 6000000);

    fetchData();

    return () => {
      clearInterval(fetchDataInterval);
      speech.cancel();
    };
  }, [moveNext]);

  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <Snackbar
        open={appNotifyOpen}
        autoHideDuration={6000}
        onClose={handleAppNotifyClose}
      >
        <Alert
          onClose={handleAppNotifyClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          This is a success message!
        </Alert>
      </Snackbar>
      <Paper
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: 'transparent',
        }}
        elevation={3}
      >
        <div style={{ paddingLeft: '10px', color: 'white' }}>
          <h1 style={{ color: 'purple' }}>{word}</h1>
          <h4>{ipa}</h4>
        </div>
        <div
          style={{ paddingLeft: '25px', paddingRight: '10px', color: 'white' }}
        >
          <p style={{ color: 'yellow' }}>*** {meaning}</p>
          <p style={{ color: 'cyan' }}>** {examples} </p>
          <p>** {translate}</p>
        </div>
      </Paper>

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label={muted ? 'Unmute' : 'Mute'}
            icon={muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            onClick={toggleMute}
          />
          <BottomNavigationAction
            label="Easiness"
            icon={<SettingsIcon />}
            onClick={handleEasinessEditOpen}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleEasinessEditClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Typography sx={{ p: 2 }}>Rate with your taste.</Typography>
            <Rating
              name="simple-controlled"
              value={complexity}
              onChange={(event, newValue) => {
                if (newValue) {
                  updateEasiness(newValue);
                  setComplexcity(newValue);
                  handleEasinessEditClose();
                }
              }}
            />
          </Popover>
          <BottomNavigationAction
            label="Import"
            icon={<PublishIcon />}
            onClick={importNavigate}
          />
          <BottomNavigationAction label="Improve" icon={<FeedbackIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default Learn;

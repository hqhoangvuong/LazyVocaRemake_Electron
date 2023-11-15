/* eslint-disable promise/always-return */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Popover,
  Rating,
  Select,
  SelectChangeEvent,
  Slider,
  Snackbar,
  Typography,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import PublishIcon from '@mui/icons-material/Publish';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Speech from 'speak-tts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

import './learn.page.css';

const speech = new Speech();

let voices: {
  voiceURI: string;
  name: string;
  lang: string;
  default: boolean;
}[] = [];

speech
  .init({
    volume: 1,
    lang: 'en-GB',
    rate: 0.7,
    pitch: 1,
    splitSentences: true,
    listeners: {
      onvoiceschanged: (newVoices: string) => {
        console.log('Event voiceschanged', newVoices);
      },
    },
  })
  .then((data: any) => {
    voices = data.voices;
    console.log(voices);
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

  const [appNotifyMsg, setAppNotifyMsg] = React.useState<string>('');

  const [appNotifySeverity, setAppNotifySeverity] =
    React.useState<AlertColor>();

  const [id, setId] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [ipa, setIpa] = useState<string>('');
  const [meaning, setMeaning] = useState<string>('');
  const [examples, setExamples] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [complexity, setComplexcity] = useState<number>(0);
  const [moveNext, setMoveNext] = useState<number>(0);

  const [openVoiceSetting, setOpenVoiceSetting] =
    React.useState<boolean>(false);

  const [voiceSpeed, setVoiceSpeed] = useState<number>(10);
  const [voiceLanguage, setVoiceLanguage] = useState<string>('en-US');
  const [voiceName, setVocieName] = useState<string>();
  const [voicePitch, setVoicePitch] = useState<number>(10);

  const { token } = useAuth();

  const toggleMute = () => {
    setMuted(!muted);
    if (!muted) {
      // speech.cancel();
      // speech.setVolume(0.01);

      window.electron.ipcRenderer.audioMuted();
    } else {
      // speech.setVolume(1);
      window.electron.ipcRenderer.audioUnmuted();
    }
  };

  const importNavigate = () => {
    navigate('/import');
  };

  function timeout(delay: number) {
    return new Promise((res) => {
      setTimeout(res, delay);
    });
  }

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
        setId(response.data.id);
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

        await timeout(12000);

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

  const updateEasiness = async (newValue: number) => {
    setComplexcity(newValue);

    const response = await fetch(
      `http://103-195-7-220.cloud-xip.com:1027/api/Vocabulary/update-easiness/${id}/${newValue}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 204) {
      setAppNotifySeverity('success');
      setAppNotifyMsg(`Easiness was successfully set to ${newValue}`);
    } else {
      setAppNotifySeverity('error');
      setAppNotifyMsg(
        `One or more errors occured. Please contact administrator.`,
      );
    }

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

  const handleVoiceSettingOpen = () => {
    setOpenVoiceSetting(true);
  };

  const handleVoiceSettingClose = () => {
    setOpenVoiceSetting(false);
  };

  const handleVoiceSpeedSettingChanged = (
    event: Event,
    newValue: number | number[],
  ) => {
    setVoiceSpeed(newValue as number);
  };

  const handleVoicePitchSettingChanged = (
    event: Event,
    newValue: number | number[],
  ) => {
    setVoicePitch(newValue as number);
  };

  const handleVoiceNameChanged = (event: SelectChangeEvent) => {
    setVocieName(event.target.value);
    setVoiceLanguage(
      voices.find((v) => v.name === event.target.value)?.lang ?? 'en-US',
    );

    console.log(`new voice ${voiceName}, new language ${voiceLanguage}`);
  };

  const handleVoiceSettingSaveClick = () => {
    speech.setRate(voiceSpeed / 10);
    speech.setVoice(voiceName);
    speech.setLanguage(voiceLanguage);

    setAppNotifySeverity('success');
    setAppNotifyMsg('Your changes will take effect after this word');

    setOpenVoiceSetting(false);
    setAppNotifyOpen(true);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 60000);

    fetchData();

    return () => {
      clearInterval(fetchDataInterval);
      speech.cancel();
    };
  }, [moveNext]);

  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Box sx={{ pb: 7 }} ref={ref}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={appNotifyOpen}
          autoHideDuration={3000}
          onClose={handleAppNotifyClose}
        >
          <Alert
            variant="filled"
            onClose={handleAppNotifyClose}
            severity={appNotifySeverity}
            sx={{ width: '100%' }}
          >
            {appNotifyMsg}
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
            <h2 style={{ color: 'purple' }}>{word}</h2>
            <p style={{ color: '#656565' }}>{ipa}</p>
          </div>
          <div
            style={{
              paddingLeft: '25px',
              paddingRight: '10px',
              color: 'white',
            }}
          >
            <p style={{ color: '#6A359D' }}>{meaning}</p>
            <p style={{ color: '#1D3C8E' }}>
              <i>{examples}</i>
            </p>
            <p style={{ color: '#177245' }}>{translate}</p>
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
              icon={<ThumbsUpDownIcon />}
              onClick={handleEasinessEditOpen}
            />
            <Popover
              id={popoverId}
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
                sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
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
              label="Settings"
              icon={<GraphicEqIcon />}
              onClick={handleVoiceSettingOpen}
            />
            <BottomNavigationAction
              label="Import"
              icon={<PublishIcon />}
              onClick={importNavigate}
            />
            <BottomNavigationAction label="Improve" icon={<FeedbackIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
      <Dialog open={openVoiceSetting} onClose={handleVoiceSettingClose}>
        <DialogTitle>Speaker voice setting</DialogTitle>
        <DialogContent sx={{ m: 1, minWidth: 250 }}>
          <Select
            value={
              voiceName ??
              voices.find((v) => v.default === true)?.voiceURI ??
              ''
            }
            onChange={handleVoiceNameChanged}
            sx={{ marginBottom: 1, minWidth: 250 }}
          >
            {voices.map((voice) => (
              <MenuItem key={voice.voiceURI} value={voice.name}>
                {voice.name.split(' - ')[0]}
              </MenuItem>
            ))}
          </Select>

          <Box>
            <Typography gutterBottom>Speed</Typography>
            <Slider
              aria-label="Speed"
              value={voiceSpeed}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
              onChange={handleVoiceSpeedSettingChanged}
            />
          </Box>
          <Box>
            <Typography gutterBottom>Pitch</Typography>
            <Slider
              aria-label="Pitch"
              value={voicePitch}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
              onChange={handleVoicePitchSettingChanged}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVoiceSettingClose}>Cancel</Button>
          <Button onClick={handleVoiceSettingSaveClick}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Learn;

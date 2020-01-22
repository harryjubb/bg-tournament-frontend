import React from 'react';
import {useState} from 'react';

import {useHistory} from "react-router-dom";

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Home: React.FC = () => {

  const history = useHistory()

  const [eventCode, setEventCode] = useState('')

  const navigateToEvent = (eventCode: String) => history.push(`/event/${eventCode}`)

  const eventCodeInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventCode(event.target.value)
  }

  const eventCodeInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      navigateToEvent(eventCode)
      event.preventDefault();
    }
  }


  return (
    <Box display="flex" alignItems="center" justifyContent="center" css={{height: '100vh', width: '100vw'}}>
      <Box>
        <Box>
          <Typography variant="h1" gutterBottom>
            Board Game Tournament
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <TextField
            label="Event code"
            type="search"
            variant="outlined"
            value={eventCode}
            onChange={eventCodeInputChanged}
            onKeyPress={eventCodeInputKeyPress}
            fullWidth
          />
          &nbsp;
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigateToEvent(eventCode)}
          >
            Go
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;

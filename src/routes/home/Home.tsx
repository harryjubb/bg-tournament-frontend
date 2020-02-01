import React from 'react';
import {Helmet} from "react-helmet";
import {useState} from 'react';

import {useHistory} from "react-router-dom";

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Home: React.FC = () => {

  const history = useHistory()

  const [eventCode, setEventCode] = useState('')
  const [eventCodeError, setEventCodeError] = useState(false)
  const [eventCodeLabel, setEventCodeLabel] = useState('Event code')

  const navigateToEvent = (eventCode: String) => {
    if (eventCode.trim() === '') {
      setEventCodeLabel('Please enter an event code')
      setEventCodeError(true)
      return
    }
    history.push(`/event/${eventCode}`)
  }

  const eventCodeInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventCodeLabel('Event code')
    setEventCodeError(false)
    setEventCode(event.target.value)
  }

  const eventCodeInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      navigateToEvent(eventCode)
      event.preventDefault();
    }
  }


  return (
    <Container
      maxWidth="xl"
      style={{height: '50vh'}}
    >
      <Helmet>
        <title>Board Game Tournament</title>
      </Helmet>
      <Grid
        container
        xs={12}
        alignItems="center"
        style={{height: 'inherit'}}
      >
        <Grid
          container
          xs={12}
          justify="center"
        >
          <Grid
            item
            xs={12}
            style={{textAlign: 'center', marginBottom: '16px'}}
          >
            <Typography variant="h2" gutterBottom>
              Board Game Tournament
        </Typography>
          </Grid>

          <Grid
            container
            item
            xs={12}
            sm={10}
            md={8}
            lg={5}
            xl={4}
            spacing={2}
            justify="center"
            style={{flexGrow: 1}}
          >
            <TextField
              label={eventCodeLabel}
              type="search"
              variant="outlined"
              value={eventCode}
              onChange={eventCodeInputChanged}
              onKeyPress={eventCodeInputKeyPress}
              autoFocus
              style={{flexGrow: 1, marginRight: '8px'}}
              error={eventCodeError}
            />
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => navigateToEvent(eventCode)}
            >
              Go
        </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container >
  );
}

export default Home;

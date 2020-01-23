import React from 'react';
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
    /* direction="column" */
    /* justify="center" */
    /* alignItems="center" */
    /* style={{height: '100vh'}} */
    <Container
      maxWidth="xl"
      style={{height: '100vh'}}
    >
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
            style={{textAlign: 'center'}}
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
            lg={6}
            xl={3}
            spacing={2}
            justify="center"
            style={{flexGrow: 1}}
          >
            <TextField
              label="Event code"
              type="search"
              variant="outlined"
              value={eventCode}
              onChange={eventCodeInputChanged}
              onKeyPress={eventCodeInputKeyPress}
              autoFocus
              style={{flexGrow: 1, marginRight: '8px'}}
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

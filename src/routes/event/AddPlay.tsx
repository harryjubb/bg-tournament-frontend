import React, {useState} from 'react'
import {useParams} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

/* import {withStyles, createStyles, makeStyles, Theme} from '@material-ui/core/styles'; */

import {ThemeProvider, createMuiTheme, createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {green, red} from '@material-ui/core/colors';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
/* import Divider from '@material-ui/core/Divider'; */
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Autocomplete from '@material-ui/lab/Autocomplete';

const GET_EVENT = gql`
query ($eventCode: String!) {
  event (code: $eventCode) {
    id
    code
    name
    players {
      id
      name
    }
  }
  games {
    id
    name
  }
}
`

const buttonTheme = createMuiTheme({
  palette: {
    primary: green,
    secondary: red,
    /* default: grey */
  }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    cancelButton: {
      marginRight: theme.spacing(0.5)
    }
  }),
);


const AddPlay: React.FC = () => {

  const classes = useStyles()
  const {eventCode} = useParams()

  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [playPlayerState, setPlayPlayerState] = useState<any>(null)

  const {data, loading, error} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    },
    onCompleted: data => {
      setPlayPlayerState(Object.fromEntries(
        data?.event?.players?.map((player: any) => [player.id, 'neither']) ?? []
      ))
    }
  })

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>todo error</div>}


  return <Grid container xs={12}>
    <Typography variant="h2" gutterBottom>Add play</Typography>

    {/* Game */}
    <Autocomplete
      options={data.games}
      getOptionLabel={(option: any) => option.name}
      style={{width: '100%'}}
      value={selectedGame}
      onChange={(event: any, newValue: string | null) => {
        setSelectedGame(newValue);
      }}
      renderInput={params => (
        <TextField {...params} label="Game" variant="outlined" fullWidth />
      )}
    />

    {/* {JSON.stringify(playPlayerState)} */}

    <List className={classes.root}>
      {
        data.event.players.map((player: any) => (<div key={player.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={player.name} src="/broken-image.jpg">
                {/* TODO: Factor out (Harry Jubb, Wed 29 Jan 2020 21:48:16 GMT) */}
                {player.name.slice(0, 1).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<React.Fragment>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={2} md={1} xl={1} lg={1}>
                    {player.name}
                  </Grid>
                  <Grid item>
                    <ThemeProvider theme={buttonTheme}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                      <Button
                        variant={
                          playPlayerState &&
                            playPlayerState[player.id] === 'loser' ?
                            'contained' :
                            'outlined'
                        }
                        color="secondary"
                        onClick={() => setPlayPlayerState({
                          ...playPlayerState,
                          [player.id]: 'loser'
                        })}
                      >
                        Loser
                        </Button>

                      <Button
                        variant={
                          playPlayerState &&
                            playPlayerState[player.id] === 'neither' ?
                            'contained' :
                            'outlined'
                        }
                        color='default'
                        onClick={() => setPlayPlayerState({
                          ...playPlayerState,
                          [player.id]: 'neither'
                        })}
                      >
                        N/A
                      </Button>

                      <Button
                        variant={
                          playPlayerState &&
                            playPlayerState[player.id] === 'winner' ?
                            'contained' :
                            'outlined'
                        }
                        color="primary"
                        onClick={() => setPlayPlayerState({
                          ...playPlayerState,
                          [player.id]: 'winner'
                        })}
                      >
                        Winner
                      </Button>
                    </ButtonGroup>
                    </ThemeProvider>
                  </Grid>
                </Grid>
              </React.Fragment>}
            />
          </ListItem>
        </div>
        ))
      }
    </List>

    <Grid container item xs={12} alignItems="center" justify="flex-end">
      <Button className={classes.cancelButton}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={
          !selectedGame ||
            !Object.values(playPlayerState).some(state => state === 'winner') ||
            !Object.values(playPlayerState).some(state => state === 'loser')
        }>
        Add
      </Button>
    </Grid>

    {/* {JSON.stringify(data)} */}
  </Grid>
}

export default AddPlay

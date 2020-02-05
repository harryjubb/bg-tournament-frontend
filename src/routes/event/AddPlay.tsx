import React, {useState} from 'react'
import {useParams, useHistory, Link as RouterLink} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery, useMutation} from '@apollo/react-hooks';

/* import {withStyles, createStyles, makeStyles, Theme} from '@material-ui/core/styles'; */

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
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
      avatarUrl
    }
  }
  games {
    id
    name
  }
}
`

const ADD_PLAY = gql`
mutation ($eventId: UUID!, $gameId: UUID!, $winnerIds: [UUID!]!, $loserIds: [UUID!]!) {
  addPlay (eventId: $eventId, gameId: $gameId, winnerIds: $winnerIds, loserIds: $loserIds) {
    ok
  }
}
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    mrButton: {
      marginRight: theme.spacing(1)
    },
    breadcrumbs: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  }),
);

interface Game {
  id: string,
  name: string
}


const AddPlay: React.FC = () => {

  const classes = useStyles()
  const history = useHistory()
  const {eventCode} = useParams()

  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [playPlayerState, setPlayPlayerState] = useState<any>(null)
  const [addDisabled, setAddDisabled] = useState<boolean>(false)

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

  const [addPlay, {data: addPlayData}] = useMutation(ADD_PLAY)

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>todo error</div>}


  const submitPlay = async () => {

    /* TODO: Set validation state of game input (Harry Jubb, Thu 30 Jan 2020 22:10:14 GMT) */
    if (!selectedGame) return

    const winnerIds = Object.entries(playPlayerState).filter(([playerId, playerState]) => playerState === 'winner').map(([playerId, playerState]) => playerId)
    const loserIds = Object.entries(playPlayerState).filter(([playerId, playerState]) => playerState === 'loser').map(([playerId, playerState]) => playerId)

    /* TODO: Set validation state for winners/losers (Harry Jubb, Thu 30 Jan 2020 22:11:56 GMT) */
    if (!winnerIds) throw new Error('No winner IDs')
    if (!loserIds) throw new Error('No loser IDs')

    setAddDisabled(true)

    let addPlayResult
    try {
      addPlayResult = await addPlay({
        variables: {
          eventId: data.event.id,
          gameId: selectedGame.id,
          winnerIds,
          loserIds
        }
      })
    } catch (error) {
      console.error(error)
      setAddDisabled(false)
      /* TODO: Show error message to user (Harry Jubb, Fri 31 Jan 2020 00:23:56 GMT) */
      throw new Error('Could not add play')
    }

    if (!addPlayResult?.data?.addPlay?.ok) {
      console.error(error)
      setAddDisabled(false)
      /* TODO: Show error message to user (Harry Jubb, Fri 31 Jan 2020 00:23:56 GMT) */
      throw new Error('Could not add play')
    }

  }

  const addClicked = async () => {

    try {
      await submitPlay()
    } catch (error) {
      // Nothing for now
    }

    // Redirect back to event
    history.push(`/event/${eventCode}`)

  }

  const addWithMoreClicked = async () => {

    try {
      await submitPlay()
    } catch (error) {
      // Nothing for now
    }

    // Reset form
    setPlayPlayerState(Object.fromEntries(
      data?.event?.players?.map((player: any) => [player.id, 'neither']) ?? []
    ))
    setAddDisabled(false)


  }

  return <Grid container xs={12}>
    <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
      <Link color="inherit" component={RouterLink} to={`/event/${eventCode}`}>
        {data?.event?.name ?? eventCode}
      </Link>
      <Typography color="textPrimary">Add play</Typography>
    </Breadcrumbs>

    {/* Game */}
    <Autocomplete
      options={[...data.games].sort((a, b) => a.name > b.name ? 1 : -1)}
      getOptionLabel={(option: any) => option.name}
      style={{width: '100%'}}
      value={selectedGame}
      onChange={(event: any, newValue: Game | null) => {
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
              <Avatar alt={player.name} src={player.avatarUrl ?? null}>
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
                          [player.id]: playPlayerState[player.id] === 'loser' ? 'neither' : 'loser'
                        })}
                      >
                        Loser
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
                          [player.id]: playPlayerState[player.id] === 'winner' ? 'neither' : 'winner'
                        })}
                      >
                        Winner
                      </Button>
                    </ButtonGroup>
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
      <Button
        className={classes.mrButton}
        disabled={addDisabled}
        onClick={() => history.push(`/event/${eventCode}`)}
      >
        Cancel
      </Button>
      <Button
        className={classes.mrButton}
        variant="outlined"
        color="primary"
        disabled={
          !selectedGame ||
          !Object.values(playPlayerState).some(state => state === 'winner') ||
          !Object.values(playPlayerState).some(state => state === 'loser') ||
          addDisabled
        }
        onClick={addWithMoreClicked}
      >
        Save and add new
      </Button><Button
        variant="contained"
        color="primary"
        disabled={
          !selectedGame ||
          !Object.values(playPlayerState).some(state => state === 'winner') ||
          !Object.values(playPlayerState).some(state => state === 'loser') ||
          addDisabled
        }
        onClick={addClicked}
      >
        Save
      </Button>
    </Grid>
    <Grid container item xs={12} alignItems="center" justify="flex-end">
      &nbsp;<br />&nbsp;
    </Grid>

    {/* {JSON.stringify(data)} */}
  </Grid>
}

export default AddPlay

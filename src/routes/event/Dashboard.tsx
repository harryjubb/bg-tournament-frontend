import React from 'react';
import {Link, useParams, useRouteMatch} from 'react-router-dom'

import Loading from '../../Loading'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

// @ts-ignore
import Websocket from 'react-websocket';

import {withStyles, createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
/* import Divider from '@material-ui/core/Divider'; */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';

import StarsIcon from '@material-ui/icons/Stars';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import FlipMove from 'react-flip-move';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import UIfx from 'uifx'
/* import eventUpdatedMp3 from './bell.mp3' */

/* import Button from '@material-ui/core/Button'; */
/* import ShareIcon from '@material-ui/icons/Share'; */

/* const useStyles = makeStyles((theme: Theme) => createStyles({ */
/*   button: { */
/*     margin: theme.spacing(1), */
/*     verticalAlign: 'center' */
/*   }, */
/* })); */

const eventUpdatedSound = new UIfx(`${process.env.PUBLIC_URL}/audio/bell.mp3`)

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -10,
      top: 20,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    scoreDisplay: {
      marginTop: theme.spacing(0.5)
    },
    pointsDisplay: {
      color: '#d4af37'
    },
    winDisplay: {
      color: 'green'
    },
    lossDisplay: {
      color: 'red'
    },
    ratioDisplay: {
      color: 'gray'
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);


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
      eventPlayCount (eventCode: $eventCode)
      eventWinCount (eventCode: $eventCode)
      eventLossCount (eventCode: $eventCode)
      eventTotalScore (eventCode: $eventCode)
    }
  }
}
`

const nth = (n: number) => ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"

const Dashboard: React.FC = () => {

  const {url} = useRouteMatch();

  const classes = useStyles();
  const {eventCode} = useParams()
  const {loading, error, data, refetch} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    },
    fetchPolicy: 'network-only'
  })

  if (loading) {return <Loading />}
  if (error) {return <div>Unable to load event</div>}

  const {event} = data
  const {name, code, players} = event
  const sortedPlayers = [...players].sort((a, b) => a.eventTotalScore > b.eventTotalScore ? -1 : 1)
  const sortedPlayerScores = sortedPlayers.map(player => player.eventTotalScore)

  const processedSortedPlayers = sortedPlayers.map(player => ({
    ...player,
    initial: player.name.slice(0, 1).toUpperCase(),
    score: player.eventTotalScore,
    displayedScore: Number(player.eventTotalScore).toFixed(0),
    rank: sortedPlayerScores.indexOf(player.eventTotalScore) + 1,
    wins: player.eventWinCount,
    losses: player.eventLossCount,
    winLossRatio: (player.eventWinCount / player.eventPlayCount) || 0,
    winLossPercent: `${Math.min((((player.eventWinCount / player.eventPlayCount) || 0) * 100), 100).toFixed(0) || 0}% `
  }))

  const maxWins = Math.max(...processedSortedPlayers.map(player => player.wins))
  const maxLosses = Math.max(...processedSortedPlayers.map(player => player.losses))
  const maxWinLossRatio = Math.max(...processedSortedPlayers.map(player => player.winLossRatio))
  const maxPlays = Math.max(...processedSortedPlayers.map(player => player.wins + player.losses))

  const eventUpdated = async (data: string) => {
    const result = JSON.parse(data)
    if (result.type === 'event.updated') {
      const refetchedEvent = await refetch()
      console.log(refetchedEvent)
      if (refetchedEvent?.data?.event?.id && !refetchedEvent?.errors) {
        eventUpdatedSound.play()
      }
    }
  }

  return (
    <React.Fragment>

      <Websocket url={`${process.env.REACT_APP_TOURNAMENT_WEBSOCKET_URL}/event/${eventCode}/`} onMessage={eventUpdated} />

      {/* <Typography variant="h4" gutterBottom> */}
      {/*   Leaderboard */}
      {/* </Typography> */}

      {/* {JSON.stringify(data)} */}

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <List className={classes.root}>
          <FlipMove>
            {processedSortedPlayers.map((player, index) => <div key={`${player.id}`}><ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginRight: '25px'}}>
                <StyledBadge badgeContent={`${player.rank}${(nth(player.rank))}`} color='secondary'>
                  <Avatar alt={player.name} src={player.avatarUrl ?? null}>
                    {player.initial}
                  </Avatar>
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment>
                  {player.name}
                  {/* &mdash; {index + 1}{(nth(index + 1))} */}
                </React.Fragment>}
                secondary={
                  <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    className={classes.scoreDisplay}
                  >
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        style={{color: 'black'}}
                      >
                        <StarsIcon className={classes.pointsDisplay} fontSize="small" />&nbsp;{player.displayedScore}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.winDisplay}
                      >
                        <ThumbUpIcon fontSize="small" />&nbsp;&nbsp;{player.wins}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.lossDisplay}
                      >
                        <ThumbDownIcon fontSize="small" />&nbsp;&nbsp;{player.losses}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.ratioDisplay}
                      >
                        <ThumbsUpDownIcon fontSize="small" />&nbsp;&nbsp;{player.winLossPercent}
                      </Grid>
                    </Grid>
                    <Hidden smDown>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justify="center"
                          spacing={1}
                          className={classes.ratioDisplay}
                        >
                          {/* Achievements */}
                          {
                            player.wins && player.wins === maxWins ?
                              <React.Fragment>
                                <Chip size="small" icon={<ThumbUpIcon />} label="Most wins" />&nbsp;&nbsp;
                            </React.Fragment>
                              : null
                          }
                          {
                            player.losses && player.losses === maxLosses ?
                              <React.Fragment>
                                <Chip size="small" icon={<ThumbDownIcon />} label="Most losses" />&nbsp;&nbsp;
                            </React.Fragment>
                              : null
                          }
                          {
                            player.winLossRatio && player.winLossRatio === maxWinLossRatio ?
                              <React.Fragment>
                                <Chip size="small" icon={<ThumbsUpDownIcon />} label="Best W/L ratio" />&nbsp;&nbsp;
                            </React.Fragment>
                              : null
                          }
                          {
                            (player.wins || player.losses) && player.wins + player.losses === maxPlays ?
                              <React.Fragment>
                                <Chip size="small" icon={<PlayCircleFilledIcon />} label="Most plays" />&nbsp;&nbsp;
                            </React.Fragment>
                              : null
                          }
                        </Grid>
                      </Grid>
                    </Hidden>
                  </Grid>
                }
              />
            </ListItem>
              <Divider variant="inset" component="li" />
            </div>)
            }
          </FlipMove>
        </List>
      </Grid>
      <Link to={`${url}/play/add`}>
        <Fab className={classes.fab} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Link>
    </React.Fragment >
  )
}
export default Dashboard

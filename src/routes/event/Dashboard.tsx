import React from 'react';
import {useParams} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
/* import Divider from '@material-ui/core/Divider'; */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import StarsIcon from '@material-ui/icons/Stars';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

/* import Button from '@material-ui/core/Button'; */
/* import ShareIcon from '@material-ui/icons/Share'; */

/* const useStyles = makeStyles((theme: Theme) => createStyles({ */
/*   button: { */
/*     margin: theme.spacing(1), */
/*     verticalAlign: 'center' */
/*   }, */
/* })); */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
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

  const classes = useStyles();
  const {eventCode} = useParams()
  const {loading, error, data} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    }
  })

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>Unable to load event</div>}

  const {event} = data
  const {name, code, players} = event
  const processedPlayers = [...players].sort((a, b) => a.eventTotalScore > b.eventTotalScore ? -1 : 1).map(player => ({
    ...player,
    initial: player.name.slice(0, 1).toUpperCase(),
    score: Number(player.eventTotalScore).toFixed(0),
    wins: player.eventWinCount,
    losses: player.eventLossCount,
    winLossPercent: `${Math.min(((player.eventWinCount / player.eventPlayCount) * 100), 100).toFixed(0) || 0}% `
  }))

  return (
    <React.Fragment>

      <Typography variant="h2" gutterBottom>
        Leaderboard
      </Typography>

      {/* {JSON.stringify(data)} */}

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
        xs={12}
      >
        <List className={classes.root}>
          {

            processedPlayers.map((player, index) => <React.Fragment><ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                  xs={12}
                >
                  <Avatar alt={player.name} src="/broken-image.jpg">
                    {player.initial}
                  </Avatar>
                  <Typography variant="caption" color="textSecondary">
                    {index + 1}{(nth(index + 1))}
                  </Typography>
                </Grid>
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment>
                  {player.name}
                </React.Fragment>}
                secondary={
                  <React.Fragment>
                    {/* className={classes.inline} */}
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      <StarsIcon />
                      {player.score}
                    </Typography>
                    {
                      <React.Fragment>
                        <ThumbUpIcon style={{marginRight: '8px'}} />{player.wins}
                        <ThumbDownIcon style={{marginRight: '8px'}} /> {player.losses}
                        <ThumbsUpDownIcon style={{marginRight: '8px'}} /> {player.winLossPercent}
                      </React.Fragment>
                    }
                  </React.Fragment>
                }
              />
            </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>)
          }
        </List>
      </Grid>

    </React.Fragment >
  )
}
export default Dashboard

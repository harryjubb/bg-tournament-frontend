import React from 'react';
import {useParams} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

/* import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'; */
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
/* import Divider from '@material-ui/core/Divider'; */
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

  /* const classes = useStyles(); */
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

      <Typography variant="h2">
        {name ?? 'Unknown event'}
      </Typography>
      <Typography variant="h4" gutterBottom color="textSecondary">
        {code ?? 'Unknown event code'}
        {/*   <Button */}
        {/*     variant="contained" */}
        {/*     color="primary" */}
        {/*     className={classes.button} */}
        {/*     startIcon={<ShareIcon />} */}
        {/*   > */}
        {/*     Share */}
        {/* </Button> */}
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
        {

          processedPlayers.map((player, index) => <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Avatar alt={player.name} src="/broken-image.jpg" style={{marginRight: '8px'}}>
                      {player.initial}
                    </Avatar>
                  </Grid>
                  <Grid item xl={1} lg={1} md={1} sm={12} xs={12} alignItems="center">
                    <Typography variant="h5">
                      {player.name}
                    </Typography>
                  </Grid>
                  {/* <Divider orientation="vertical" /> */}
                  <Grid item container md={1} sm={1} xs={3} alignItems="center">
                    <Typography variant="h5" component="h5" color="secondary">
                      {index + 1}{(nth(index + 1))}
                    </Typography>
                  </Grid>
                  <Grid item container md={1} sm={3} xs={3} alignItems="center">
                    <Typography variant="h5" component="h5" color="primary">
                      <StarsIcon style={{marginRight: '8px'}} />
                      {player.score}
                    </Typography>
                  </Grid>
                  <Grid item container md={1} sm={3} xs={3} alignItems="center">
                    <Typography variant="h5" component="h5" style={{color: 'green'}}>
                      <ThumbUpIcon style={{marginRight: '8px'}} />
                      {player.wins}
                    </Typography>
                  </Grid>
                  <Grid item container md={1} sm={3} xs={3} alignItems="center">
                    <Typography variant="h5" component="h5" style={{color: 'red'}}>
                      <ThumbDownIcon style={{marginRight: '8px'}} />
                      {player.losses}
                    </Typography>
                  </Grid>
                  <Grid item container md={1} sm={3} xs={3} alignItems="center">
                    <Typography variant="h5" component="h5">
                      <ThumbsUpDownIcon style={{marginRight: '8px'}} />
                      {player.winLossPercent}
                    </Typography>
                  </Grid>
                  {/* {player.eventTotalScore ?? 'Unknown score'} */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>)

        }
      </Grid>

    </React.Fragment >
  )
}
export default Dashboard

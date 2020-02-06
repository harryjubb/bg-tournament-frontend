import React, {useState, useEffect} from 'react';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mt: {
      marginTop: theme.spacing(2),
    },
  }),
);


const Loading: React.FC = () => {

  console.log('loading component rendered')

  const classes = useStyles()

  const [timedOut, setTimedOut] = useState<boolean>(false)

  useEffect(() => {
    console.log('loading effect')
    const timer = setTimeout(() => {
      console.log('loadign on')
      setTimedOut(true)
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  return timedOut ?
    <Grid
      container
      xs={12}
      alignItems="center"
      justify="center"
      className={classes.mt
      }
    >
      <Grid
        container
        item
        xs={12}
        justify="center"
      >
        <CircularProgress />
      </Grid>
    </Grid >
    : null
}

export default Loading;

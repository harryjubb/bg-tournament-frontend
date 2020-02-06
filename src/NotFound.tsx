import React from 'react';
import {Container, Typography, Link} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom'

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mt: {
      marginTop: theme.spacing(2)
    },
  }),
);

const Loading: React.FC = () => {

  const classes = useStyles()

  return (
    <Container
      className={classes.mt}
      maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Destination not found.
      </Typography>
      <Typography variant="body1">
        <Link component={RouterLink} to="/">Return home</Link>
      </Typography>
    </Container>
  );
}

export default Loading;

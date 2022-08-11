import React from 'react';
import {
  Button, Grid, LinearProgress, Paper,
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import './App.scss';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { User } from './typedfs';
import usersFromServer from './people.json';

interface State {
  users: User[];
  isLoading: boolean;
  selectedUserSlug: string | null;
}

export class App extends React.Component<{}, State> {
  state: State = {
    users: [],
    isLoading: false,
    selectedUserSlug: null,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    setTimeout(
      () => this.setState({ users: usersFromServer, isLoading: false }),
      1000,
    );
  }

  selectUserHandler(slug: string) {
    this.setState({ selectedUserSlug: slug });
  }

  getSelectedUser(): User | null {
    const { selectedUserSlug, users } = this.state;

    return users.find((user) => user.slug === selectedUserSlug) || null;
  }

  unselectUser() {
    this.setState({ selectedUserSlug: null });
  }

  render() {
    const { users, isLoading, selectedUserSlug } = this.state;
    const selectedUser = this.getSelectedUser();

    return (
      <Grid container spacing={3} sx={{ padding: '20px' }}>
        <Grid item xs={6}>
          {isLoading && <LinearProgress /> }

          {users.length === 0 && !isLoading && (
            <SentimentVeryDissatisfiedIcon fontSize="large" color="warning" />
          )}

          {users.length > 0 && (
            <Paper elevation={12} sx={{ height: '90vh', overflowY: 'auto' }}>
              <List>
                {users.map(user => (
                  <ListItem key={user.slug}>
                    <ListItemText
                      primary={user.name}
                      secondary={user.slug}
                    />
                    <Button
                      variant={user.slug === selectedUserSlug
                        ? 'contained'
                        : 'outlined'}
                      color="info"
                      onClick={() => this.selectUserHandler(user.slug)}
                    >
                      show more
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={6}>
          {selectedUser && (
            <Paper elevation={12}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {selectedUser.slug}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {selectedUser.fatherName}
                  </Typography>
                  <Typography variant="body2">
                    {selectedUser.motherName}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => this.unselectUser()} size="small">
                    Unselect
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          )}
        </Grid>

      </Grid>
    );
  }
}

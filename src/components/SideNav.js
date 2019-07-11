import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import intl from 'react-intl-universal';


import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Domain from "mdi-material-ui/Domain";

import Server from "mdi-material-ui/Server";

import RadioTower from "mdi-material-ui/RadioTower";


import theme from "../theme";


const styles = {
  drawerPaper: {
    position: "fixed",
    width: 270,
    paddingTop: theme.spacing.unit * 9,
  },
  select: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 1,
  },
};

class SideNav extends Component {
  constructor() {
    super();

    this.state = {
      open: true,
      cacheCounter: 0,
    };


    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
  }

  onChange(e) {
   
  }

  
  render() {
    return(
      <Drawer
        variant="persistent"
        anchor="left"
        open={this.props.open}
        classes={{paper: this.props.classes.drawerPaper}}
      >
        <div>
          <List>
            <ListItem button component={Link} to="/search">
              <ListItemIcon>
                <Server />
              </ListItemIcon>
              <ListItemText primary={intl.get('SEARCHADDR')} />
            </ListItem>
            <ListItem button component={Link} to="/statistics">
              <ListItemIcon>
                <RadioTower />
              </ListItemIcon>
              <ListItemText primary={intl.get('STAT')} />
            </ListItem>
            <ListItem button component={Link} to="/about">
            <ListItemIcon>
                <Domain />
              </ListItemIcon>
              <ListItemText primary={intl.get('ABOUT')} />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
    );
  }
}

export default withRouter(withStyles(styles)(SideNav));

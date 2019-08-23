import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import intl from 'react-intl-universal';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import blue from "@material-ui/core/colors/blue";

import MenuIcon from "mdi-material-ui/Menu";
import Backburger from "mdi-material-ui/Backburger";

import HelpCicle from "mdi-material-ui/HelpCircle";
 
import theme from "../theme";


const styles = {
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 10,
  },
  hidden: {
    display: "none",
  },
  flex: {
    flex: 1,
  },
  logo: {
    height: 32,
  },
  search: {
    marginRight: 3 * theme.spacing.unit,
    color: theme.palette.common.white,
    background: blue[400],
    width: 450,
    padding: 5,
    borderRadius: 3,
  },
  avatar: {
    background: blue[600],
    color: theme.palette.common.white,
  },
  chip: {
    background: blue[600],
    color: theme.palette.common.white,
    marginRight: theme.spacing.unit,
    "&:hover": {
      background: blue[400],
    },
    "&:active": {
      background: blue[400],
    },
  },
  iconButton: {
    color: theme.palette.common.white,
    marginRight: theme.spacing.unit,
  },
};


class TopNav extends Component {
  constructor() {
    super();

    this.state = {
      menuAnchor: null,
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.onMenuOpen = this.onMenuOpen.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onMenuOpen(e) {
    this.setState({
      menuAnchor: e.currentTarget,
    });
  }

  onMenuClose() {
    this.setState({
      menuAnchor: null,
    });
  }

  onLogout() {

  }

  handleDrawerToggle() {
    this.props.setDrawerOpen(!this.props.drawerOpen);
  }

  render() {
    let drawerIcon;
    if (!this.props.drawerOpen) {
      drawerIcon = <MenuIcon />;
    } else {
      drawerIcon = <Backburger />;
    }

    const open = Boolean(this.state.menuAnchor);

    return(
      <AppBar className={this.props.classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={this.handleDrawerToggle}
            className={this.props.classes.menuButton}
          >
            {drawerIcon}
          </IconButton>

          <div className={this.props.classes.flex}>
            <img src="/logo/logo.png" className={this.props.classes.logo} alt={intl.get('SITETITLE')} />
          </div>

          <a href="https://house.com" target="house-about">
            <IconButton className={this.props.classes.iconButton}>
              <HelpCicle />
            </IconButton>
          </a>

         <Menu
            id="menu-appbar"
            anchorEl={this.state.menuAnchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={this.onMenuClose}
          >
            <MenuItem onClick={this.onLogout}>{intl.get('LOGOUT')}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(withRouter(TopNav));

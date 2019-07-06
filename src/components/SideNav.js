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
import Account from "mdi-material-ui/Account";
import Server from "mdi-material-ui/Server";
import Apps from "mdi-material-ui/Apps";
import RadioTower from "mdi-material-ui/RadioTower";
import Tune from "mdi-material-ui/Tune";
import Settings from "mdi-material-ui/Settings";
import Rss from "mdi-material-ui/Rss";
import AccountDetails from "mdi-material-ui/AccountDetails";

import AutocompleteSelect from "./AutocompleteSelect";
import SessionStore from "../stores/SessionStore";
import OrganizationStore from "../stores/OrganizationStore";
import Admin from "./Admin";

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
      organization: null,
      cacheCounter: 0,
    };


    this.onChange = this.onChange.bind(this);
    this.getOrganizationOption = this.getOrganizationOption.bind(this);
    this.getOrganizationOptions = this.getOrganizationOptions.bind(this);
    this.getOrganizationFromLocation = this.getOrganizationFromLocation.bind(this);
  }

  componentDidMount() {
    SessionStore.on("organization.change", () => {
      OrganizationStore.get(SessionStore.getOrganizationID(), resp => {
        this.setState({
          organization: resp.organization,
        });
      });
    });

    OrganizationStore.on("create", () => {
      this.setState({
        cacheCounter: this.state.cacheCounter + 1,
      });
    });

    OrganizationStore.on("change", (org) => {
      if (this.state.organization !== null && this.state.organization.id === org.id) {
        this.setState({
          organization: org,
        });
      }
    });

    OrganizationStore.on("delete", id => {
      if (this.state.organization !== null && this.state.organization.id === id) {
        this.setState({
          organization: null,
        });
      }

      this.setState({
        cacheCounter: this.state.cacheCounter + 1,
      });
    });

    if (SessionStore.getOrganizationID() !== null) {
      OrganizationStore.get(SessionStore.getOrganizationID(), resp => {
        this.setState({
          organization: resp.organization,
        });
      });
    }

    this.getOrganizationFromLocation();
  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }

    this.getOrganizationFromLocation();
  }

  onChange(e) {
    this.props.history.push(`/organizations/${e.target.value}/applications`);
  }

  getOrganizationFromLocation() {
    const organizationRe = /\/organizations\/(\d+)/g;
    const match = organizationRe.exec(this.props.history.location.pathname);

    if (match !== null && (this.state.organization === null || this.state.organization.id !== match[1])) {
      SessionStore.setOrganizationID(match[1]);
    }
  }

  getOrganizationOption(id, callbackFunc) {
    OrganizationStore.get(id, resp => {
      callbackFunc({label: resp.organization.name, value: resp.organization.id});
    });
  }

  getOrganizationOptions(search, callbackFunc) {
    OrganizationStore.list(search, 10, 0, resp => {
      const options = resp.result.map((o, i) => {return {label: o.name, value: o.id}});
      callbackFunc(options);
    });
  }

  render() {
    let organizationID = "";
    if (this.state.organization !== null) {
      organizationID = this.state.organization.id;
    }

    return(
      <Drawer
        variant="persistent"
        anchor="left"
        open={this.props.open}
        classes={{paper: this.props.classes.drawerPaper}}
      >
        <Admin>
          <List>
            <ListItem button component={Link} to="/search">
              <ListItemIcon>
                <Server />
              </ListItemIcon>
              <ListItemText primary="{intl.get('SEARCHADDR')}" />
            </ListItem>
            <ListItem button component={Link} to="/statistics">
              <ListItemIcon>
                <RadioTower />
              </ListItemIcon>
              <ListItemText primary="{intl.get('STAT')" />
            </ListItem>
            <ListItem button component={Link} to="/about">
            <ListItemIcon>
                <Domain />
              </ListItemIcon>
              <ListItemText primary="{intl.get('ABOUT')}" />
            </ListItem>
          </List>
          <Divider />
        </Admin>
      </Drawer>
    );
  }
}

export default withRouter(withStyles(styles)(SideNav));

import intl from 'react-intl-universal';
import React, { Component } from "react";
import {Router} from "react-router-dom";
import { Route, Switch } from 'react-router-dom';
import classNames from "classnames";

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import history from "./history";
import theme from "./theme";

import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
import Notifications from "./components/Notifications";
import SessionStore from "./stores/SessionStore";

// map of house
import Map from "./views/house/Map";

// About me
import About from "./views/house/About";

//import Pro from "./views/house/Pro";

//simport Setup from "./views/house/Setup";

const drawerWidth = 270;

const styles = {
  root: {
    flexGrow: 1,
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  main: {
    width: "100%",
    padding: 2 * 24,
    paddingTop: 115,
    flex: 1,
  },

  mainDrawerOpen: {
    paddingLeft: drawerWidth + (2 * 24),
  },
  footerDrawerOpen: {
    paddingLeft: drawerWidth,
  },
};

require('intl/locale-data/jsonp/zh.js');

const SUPPOER_LOCALES = [
  {
    name: "简体中文",
    value: "zh-CN"
  }
];

class App extends Component {
  constructor(props) {
    super(props);


    this.state = {
      user: null,
      drawerOpen: false,
    };

    this.setDrawerOpen = this.setDrawerOpen.bind(this);
    this.onSelectLocale = this.onSelectLocale.bind(this);
  }

  componentDidMount() {
    SessionStore.on("change", () => {
      this.setState({
        user: SessionStore.getUser(),
        drawerOpen: SessionStore.getUser() != null,
      });
    });

    this.setState({
      user: SessionStore.getUser(),
      drawerOpen: SessionStore.getUser() != null,
    });
  }

  setDrawerOpen(state) {
    this.setState({
      drawerOpen: state,
    });

    this.loadLocales();
  }

  render() {
    let topNav = null;
    let sideNav = null;

    if (this.state.user !== null) {
      topNav = <TopNav setDrawerOpen={this.setDrawerOpen} drawerOpen={this.state.drawerOpen} user={this.state.user} />;
      sideNav = <SideNav open={this.state.drawerOpen} user={this.state.user} />
    }

    return (
      <Router history={history}>
        <React.Fragment>
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <div className={this.props.classes.root}>
              {topNav}
              {sideNav}
              <div className={classNames(this.props.classes.main, this.state.drawerOpen && this.props.classes.mainDrawerOpen)}>
                <Grid container spacing={24}>
                  <Switch>
                    <Route exact path="/" component={Map} />
                    <Route exact path="/about" component={About} />
                  </Switch>
                </Grid>
              </div>
              <div className={this.state.drawerOpen ? this.props.classes.footerDrawerOpen : ""}>
                <Footer />
              </div>
            </div>
            <Notifications />
          </MuiThemeProvider>
        </React.Fragment>
      </Router>
    );
  }


  loadLocales() {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: "lang",
      cookieLocaleKey: "lang"
    });
    if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
      currentLocale = "zh-CN";
    }

    http
      .get(`locales/${currentLocale}.json`)
      .then(res => {
        console.log("App locale data", res.data);
        // init method will load CLDR locale data according to currentLocale
        return intl.init({
          currentLocale,
          locales: {
            [currentLocale]: res.data
          }
        });
      })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ initDone: true });
      });
  }
}

export default withStyles(styles)(App);

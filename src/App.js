import intl from 'react-intl-universal';
import _ from "lodash";
import http from "axios";

import React, { Component } from "react";
import {Router} from "react-router-dom";
import { Route, Switch } from 'react-router-dom';
import classNames from "classnames";

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";

import history from "./history";
import theme from "./theme";

import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
// map of house
import HouseMap from "./views/house/Map";

// About me
//import About from "./views/house/About";

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
}

  componentDidMount() {    
    this.setState({
   
    drawerOpen: false
  });
  this.loadLocales();
}

setDrawerOpen(state) {
  this.setState({
    drawerOpen: state,
  });
    

  }

  render() {
    let topNav = null;
    let sideNav = null;

  
    

    topNav = <TopNav setDrawerOpen={this.setDrawerOpen} drawerOpen={this.state.drawerOpen} user={this.state.user} />;
      
    sideNav = <SideNav open={this.state.drawerOpen} user={this.state.user} />
      

    // const theme = createMuiTheme({
    //   typography: {
    //     useNextVariants: true,

    //  }
    // });
    return (
      <Router history={history}>
        <React.Fragment>
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <div className={this.props.classes.root}>
              {topNav}
              {sideNav}
              <div className={classNames(this.props.classes.main, this.state.drawerOpen && this.props.classes.mainDrawerOpen)}>
                  <Switch>
                    <Route exact path="/" component={HouseMap} />
                  </Switch>
              </div>
              <div className={this.state.drawerOpen ? this.props.classes.footerDrawerOpen : ""}>
                <Footer />
              </div>
            </div>           
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

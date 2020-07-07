import { Provider } from "react-redux";
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import store from "./store";
import { loadUser } from "./actions/auth";
import PrivateRoute from "./utils/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";

import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Profile from "./components/dashboard/Profile";
import Dashboard from "./components/dashboard/Dashboard";
import AddEducation from "./components/dashboard/AddEducation";
import AddExperience from "./components/dashboard/AddExperience";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/add-edu" component={AddEducation} />
              <PrivateRoute exact path="/add-exp" component={AddExperience} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

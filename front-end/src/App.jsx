import styles from "./App.module.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { HomePage, SignInPage, AddEventPage, AdminPage, EventPage } from "./pages";
import { useCookies } from "react-cookie";
import React from "react";
import { PrivilegeEnum } from "./tools";

/*
Route: used by unauthenticated user
UserRoute: used by authenticated user
AdminRoute: used by admin user
*/
const UserRoute = ({ component, isAuthenticated, ...rest }) => {
  const routeComponent = (props) => {
    return isAuthenticated ? React.createElement(component, props) : <Redirect to={{ pathname: "/signIn" }} />;
  };
  return <Route render={routeComponent} {...rest} />;
};

const AdminRoute = ({ component, isAdmin, ...rest }) => {
  const routeComponent = (props) => {
    return isAdmin ? React.createElement(component, props) : <Redirect to={{ pathname: "/signIn" }} />;
  };
  return <Route render={routeComponent} {...rest} />;
};

function App() {
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  const isAuthenticated = cookies["jwt_token"] && cookies["refresh_token"] && cookies["user_privilege"];
  const isAdmin = cookies["jwt_token"] && cookies["refresh_token"] && cookies["user_privilege"] == PrivilegeEnum.Admin; // "1" == 1

  return (
    <div className={styles["app"]}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signIn" component={SignInPage} />
          <UserRoute isAuthenticated={isAuthenticated} path="/event" component={EventPage} />
          <UserRoute isAuthenticated={isAuthenticated} path="/addEvent" component={AddEventPage} />
          <AdminRoute isAdmin={isAdmin} path="/admin" component={AdminPage} />
          <Route render={() => <h1>404 not found... </h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

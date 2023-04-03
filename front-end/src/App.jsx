import styles from "./App.module.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { HomePage, SignInPage, AddEventPage } from "./pages";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";

const PrivateRoute = ({ component, isAuthenticated, ...rest }) => {
  const routeComponent = (props) => {
    return isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/signIn" }} />
    );
  };
  return <Route render={routeComponent} {...rest} />;
};

function App() {
  const [cookies] = useCookies(["jwt_token", "refresh_token"]);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const jwtToken = cookies["jwt_token"];
  //   const refreshToken = cookies["refresh_token"];
  //   console.log(jwtToken, refreshToken, isAuthenticated);
  //   if (jwtToken != null && refreshToken != null) {
  //     setIsAuthenticated(true);
  //     console.log("haha")
  //   }
  //   console.log(jwtToken, refreshToken, isAuthenticated);
  // }, [cookies]);
  const isAuthenticated =
    cookies["jwt_token"] != null && cookies["refresh_token"] != null;

  return (
    <div className={styles["app"]}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signIn" component={SignInPage} />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/addEvent"
            component={AddEventPage}
          />
          <Route render={() => <h1>404 not found... </h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

import styles from './App.module.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomePage, SignInPage, AddEventPage } from './pages';

function App() {
  return (
    <div className={styles["app"]}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signIn" component={SignInPage} />
          <Route exact path="/addEvent" component={AddEventPage} />
          <Route render={() => <h1>404 not found... </h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

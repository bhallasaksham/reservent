import styles from './App.module.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomePage } from './pages';

function App() {
  return (
    <div className={styles["app"]}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route render={() => <h1>404 not found... </h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

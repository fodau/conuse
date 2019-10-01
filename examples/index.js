import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './counter/App';
import Toggle from './toggle/App';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const App = () => (
  <Router>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
        <li>
          <Link to="/toggle">Toggle</Link>
        </li>
      </ul>
    </nav>

    <Route path="/counter">
      <Counter />
    </Route>

    <Route path="/toggle">
      <Toggle />
    </Route>
  </Router>
);

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

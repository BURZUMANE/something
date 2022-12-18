import React, {Fragment} from 'react';
import './App.css';
import MatchListComponent from "./components/MatchListComponent";

function App() {

  return <Fragment>
    <h1 className="text-amber-50 text-6xl uppercase">Live Scores</h1>
    <MatchListComponent/>
  </Fragment>
}

export default App;

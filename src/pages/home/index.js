import React, {Component} from 'react';
import firebase from '../../firebase';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

import './home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleSnapshot = this.handleSnapshot.bind(this);

    this.state = {
      scores: {}
    }

    const scoreRef = firebase.database().ref('/performance/scores')
    scoreRef.on('value', this.handleSnapshot)
  }

  handleSnapshot(snapshot) {
    this.setState({
      scores: snapshot.val()
    })
  }

  displayScores(scores) {
    const elements = [];
    console.log(scores);
    Object.entries(scores).forEach(([key, score]) => {
      elements.push(<div key={key}>{`Time: ${moment(score.fetchTime).format('MM/DD/YYYY h:mm a')}, Score: ${score.score}`}</div>)
    })
    return elements;
  }

  getGraphData(scores) {
    const labels = [];
    const data = [];

    Object.entries(scores).forEach(([key, score]) => {
      labels.push(moment(score.fetchTime).format('MM/DD/YYYY h:mm a'));
      data.push(score.score);
    })
    return {
      labels,
      data
    }
  }

  render() {
    const { scores } = this.state;
    const graphData = this.getGraphData(scores);
    const data = {
      labels: graphData.labels,
      datasets: [{
          label: 'PageSpeed Insight Performance Score',
          data: graphData.data,
          borderWidth: 1
      }]
  }
    return (
      <div>
        {Object.keys(scores).length > 0 && <Line data={data} />}
        <div className="action-container">
          <button>Start</button>
          <button>Stop</button>
        </div>
      </div>      
    )
  }
}

export default Home;
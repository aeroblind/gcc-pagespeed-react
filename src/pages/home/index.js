import React, {Component} from 'react';
import firebase from '../../firebase';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

import './home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleSnapshot = this.handleSnapshot.bind(this);
    this.limitLast100 = this.limitLast100.bind(this);
    this.updateFirebaseRefs = this.updateFirebaseRefs.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.createCheckboxes = this.createCheckboxes.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
    this.displayOptionsDidChange = this.displayOptionsDidChange.bind(this);


    this.dbRefs = {
      bcomProd: firebase.database().ref('/performance/bcom-prod/scores'),
      bcomStage: firebase.database().ref('/performance/bcom-stage/scores'),
      bcomDev: firebase.database().ref('/performance/bcom-dev/scores'),
    }
  
    this.state = {
      bcomProd: {
        show: true,
        scores: {},
        displayName: 'Prod',
      },
      bcomStage: {
        show: false,
        scores: {},
        displayName: 'Stage',
      },
      bcomDev: {
        show: false,
        scores: {},
        displayName: 'Dev',
      }
    }
  }


  componentDidUpdate(_, prevState) {
    if (this.displayOptionsDidChange(prevState)) {
      this.updateFirebaseRefs();
    }
  }
  
  componentDidMount(){
    this.updateFirebaseRefs();
  }

  displayOptionsDidChange(prevState) {
    const { bcomProd: prevBcomProd, bcomStage: prevBcomStage, bcomDev: prevBcomDev } = prevState;
    const { bcomProd, bcomStage, bcomDev } = this.state;

    if (
      bcomProd.show !== prevBcomProd.show || 
      bcomStage.show !== prevBcomStage.show || 
      bcomDev.show !== prevBcomDev.show
    ) {
      return true;
    }
    return false;
  }

  updateFirebaseRefs(){
    Object.keys(this.dbRefs).forEach((key) => {
      console.log(this.state[key].show);
      if (this.state[key].show) {
        this.dbRefs[key].on("value", (snapshot) => this.handleSnapshot(key, snapshot))
      }
    })
  }

  handleSnapshot(key,snapshot) {
    var scores = snapshot.val();
    let newObj = Object.assign({}, this.state[key])
    newObj.scores = scores;
    this.setState({
      [key]: newObj
    })
  }

  displayScores(scores) {
    const elements = [];
    Object.entries(scores).forEach(([key, score]) => {
      elements.push(<div key={key}>{`Time: ${moment(score.fetchTime).format('MM/DD/YYYY h:mm a')}, Score: ${score.score}`}</div>)
    })
    return elements;
  }

  getGraphData(label, scores) {
    const labels = [];
    const data = [];
    Object.entries(scores).forEach(([key, score]) => {
      labels.push(moment(score.fetchTime).format('MM/DD/YYYY h:mm a'));
      data.push(score.score);
    })

    return {
      labels,
      datasets: [
        {
          label,
          data,
          borderWidth: 1,
        }
      ]
    }
  }

  limitLast100(e) {
    Object.keys(this.dbRefs).forEach((key) => {
      console.log(this.state[key].show);
      if (this.state[key].show) {
        this.dbRefs[key]
        .orderByChild("fetchTime")
        .limitToLast(100)
        .on("value", (snapshot) => this.handleSnapshot(key, snapshot))
      }
    })  
  }

  handleCheckBoxChange(e) {
    const id = e.target.id;
    let newObj = Object.assign({}, this.state[id])
    newObj.show = e.target.checked;
    this.setState({
      [id]: newObj
    });
  }

  displayCharts(){
    const elements = [];
    const options = {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            max: 1
          }
        }]
      }
    }
    Object.keys(this.state).forEach(key => {

      if(this.state[key].show && Object.keys(this.state[key].scores).length > 0) {
        elements.push(
          <Line key={key} data={this.getGraphData(this.state[key].displayName, this.state[key].scores)} options={options} getElementAtEvent={this.handleClick} />
        );
      }
    })
    return elements;
  }

  createCheckboxes(){
    const elements = [];
    Object.keys(this.state).forEach(key => {
      elements.push(
        <div key={key}>
          <input onChange={this.handleCheckBoxChange} id={key} type="checkbox" checked={this.state[key].show} />
          <label htmlFor={key}>{this.state[key].displayName}</label>
        </div>
      );
    })
    return elements;
  }

  render() {

    const { bcomProd, bcomStage, bcomDev } = this.state;



    const options = {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            max: 1
          }
        }]
      }
    }

    return (
      <div>
        <div>
          {bcomProd.show && <Line data={this.getGraphData(bcomProd.displayName, bcomProd.scores)} options={options} getElementAtEvent={this.handleClick} />}
          {bcomStage.show && <Line data={this.getGraphData(bcomStage.displayName, bcomStage.scores)} options={options} getElementAtEvent={this.handleClick} />}
          {bcomDev.show && <Line data={this.getGraphData(bcomDev.displayName, bcomDev.scores)} options={options} getElementAtEvent={this.handleClick} />}
        </div>
        <div className="action-container">
          <button onClick={this.limitLast100}>Limit last 100</button>
          <button onClick={this.updateFirebaseRefs}>All</button>
        </div>
        <div>
          {this.createCheckboxes()}
        </div>
      </div>      
    )
  }
}

export default Home;
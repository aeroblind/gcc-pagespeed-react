import React, {Component} from 'react';
import firebase from '../../firebase';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import Display from './display';

import './home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleSnapshot = this.handleSnapshot.bind(this);
    this.updateFirebaseRefs = this.updateFirebaseRefs.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.dbRefs = {
      bcomProd: firebase.database().ref('/performance/bcom-prod/scores'),
      bcomStage: firebase.database().ref('/performance/bcom-stage/scores'),
      bcomDev: firebase.database().ref('/performance/bcom-dev/scores'),
    }
  
    this.state = {
      startAt: this.getTimeMinusMinutes(15),
      websites: {
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
  }

  componentDidMount(){
    this.updateFirebaseRefs(this.state.startAt);
  }

  updateFirebaseRefs(startTime){
    Object.keys(this.dbRefs).forEach((key) => {
      if (this.state.websites[key].show) {
        if(!startTime){
          //  Show all points
          this.dbRefs[key].on("value", (snapshot) => this.handleSnapshot(key, snapshot))
        } else {
          this.dbRefs[key]
          .orderByChild("fetchTime")
          .startAt(startTime)
          .on("value", (snapshot) => this.handleSnapshot(key, snapshot))
        }
      }
    })
  }

  handleSnapshot(key,snapshot) {
    var scores = snapshot.val() || {};
    let newObj = Object.assign({}, this.state.websites)
    newObj[key].scores = scores;
    this.setState({
      websites: newObj
    })
  }

  displayScores(scores) {
    const elements = [];
    Object.entries(scores).forEach(([key, score]) => {
      elements.push(<div key={key}>{`Time: ${moment(score.fetchTime).format('MM/DD/YYYY h:mm a')}, Score: ${score.score}`}</div>)
    })
    return elements;
  }

  handleCheckBoxChange(e) {
    const id = e.target.id;
    let newObj = Object.assign({}, this.state.websites)
    newObj[id].show = e.target.checked;
    this.setState({
      websites: newObj
    }, this.updateFirebaseRefs(this.state.startAt));
  }

  handleButtonClick(e) {
    const id = e.target.id;
    var startAtTime = ''
    if (id === 'all') {
      startAtTime = null
    } else {
      startAtTime = this.getTimeMinusMinutes(id);
    }
    this.setState({
      startAt: startAtTime
    }, this.updateFirebaseRefs(this.getTimeMinusMinutes(id)))
  }

  getTimeMinusMinutes(minutes) {
    return moment.utc().subtract(minutes, 'minutes').format();
  }

  render() {
    return (
      <Display 
        state={this.state} 
        handleCheckBoxChange={this.handleCheckBoxChange}
        handleButtonClick={this.handleButtonClick}
      />
    )
  }
}

export default Home;
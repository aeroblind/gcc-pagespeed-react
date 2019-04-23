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
    this.handleDataPointClick = this.handleDataPointClick.bind(this);
    this.handleMetricCheckBoxChange = this.handleMetricCheckBoxChange.bind(this);
    this.removeFirebaseListeners = this.removeFirebaseListeners.bind(this);

    this.dbRefs = {
      bcomProd: firebase.database().ref('/performance/bcom-prod/scores'),
      bcomStage: firebase.database().ref('/performance/bcom-stage/scores'),
      bcomDev: firebase.database().ref('/performance/bcom-dev/scores'),
      bcomProdPlp: firebase.database().ref('/performance/bcom-prod-plp/scores'),
      bcomStagePlp: firebase.database().ref('/performance/bcom-stage-plp/scores'),
      bcomDevPlp: firebase.database().ref('/performance/bcom-dev-plp/scores'),
      bcomProdPip: firebase.database().ref('/performance/bcom-prod-pip/scores'),
      bcomStagePip: firebase.database().ref('/performance/bcom-stage-pip/scores'),
      bcomDevPip: firebase.database().ref('/performance/bcom-dev-pip/scores'),
    }
  
    this.state = {
      startAt: this.getTimeMinusMinutes(15),
      metrics: {
        firstContentfulPaint:{
          displayName:'First Contentful Paint',
          show: true,
          dataKey: 'firstContentfulPaint',
          chartLabel: 'FCP(s)',
          color: 'red',
          factor: 1000,
        },
        speedIndex:{
          displayName: 'Speed Index',
          show: true,
          dataKey: 'speedIndex',
          chartLabel: 'SI(s)',
          color: 'blue',
          factor: 1000,
        },
        timeToInteractive:{
          displayName: 'Time to Interactive',
          show: true,
          dataKey: 'interactive',
          chartLabel: 'TTI(s)',
          color: 'teal',
          factor: 1000,
        },
        firstMeaningfulPaint:{
          displayName: 'First Meaningful Paint',
          show: false,
          dataKey: 'firstMeaningfulPaint',
          chartLabel: 'FMP(s)',
          color: 'maroon',
          factor: 1000,
        },
        firstCpuIdle:{
          displayName: 'First CPU Idle',
          show: false,
          dataKey: 'firstCPUIdle',
          chartLabel: 'FCI(s)',
          color: 'orange',
          factor: 1000,
        },
        estimatedInputLatency:{
          displayName: 'Estimated Input Latency',
          show: false,
          dataKey: 'estimatedInputLatency',
          chartLabel: 'EIL(ms)',
          color: 'yellow',
          factor: 1000,
        }
      },
      timeFormat: 'LTS',
      websites: {
        bcomProd: {
          id: 'bcomProd',
          show: true,
          scores: {},
          displayName: 'Prod',
        },
        bcomStage: {
          id: 'bcomStage',
          show: false,
          scores: {},
          displayName: 'Stage',
        },
        bcomDev: {
          id: 'bcomDev',
          show: false,
          scores: {},
          displayName: 'Dev',
        },
        bcomProdPlp: {
          id: 'bcomProdPlp',
          show: true,
          scores: {},
          displayName: 'Prod-PLP',
        },
        bcomStagePlp: {
          id: 'bcomStagePlp',
          show: false,
          scores: {},
          displayName: 'Stage-PLP',
        },
        bcomDevPlp: {
          id: 'bcomDevPlp',
          show: false,
          scores: {},
          displayName: 'Dev-PLP',
        },
        bcomProdPip: {
          id: 'bcomProdPip',
          show: true,
          scores: {},
          displayName: 'Prod-PIP',
        },
        bcomStagePip: {
          id: 'bcomStagePip',
          show: false,
          scores: {},
          displayName: 'Stage-PIP',
        },
        bcomDevPip: {
          id: 'bcomDevPip',
          show: false,
          scores: {},
          displayName: 'Dev-PIP',
        }
      }
    }
  }

  componentDidMount(){
    this.updateFirebaseRefs(this.state.startAt);
  }

  removeFirebaseListeners() {
    Object.keys(this.dbRefs).forEach((key) => {
      this.dbRefs[key].off();
    })
  }

  updateFirebaseRefs(startTime){
    this.removeFirebaseListeners();
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

  handleCheckBoxChange(e) {
    const id = e.target.id;
    let newObj = Object.assign({}, this.state.websites)
    newObj[id].show = e.target.checked;
    this.setState({
      websites: newObj
    }, this.updateFirebaseRefs(this.state.startAt));
  }

  handleMetricCheckBoxChange(e) {
    const id = e.target.id;
    let newObj = Object.assign({}, this.state.metrics)
    newObj[id].show = e.target.checked;
    this.setState({
      metrics: newObj
    });
  }

  handleButtonClick(e) {
    const id = e.target.id;
    var startAtTime = '';
    var timeFormat = 'LTS';
    if (id === 'all') {
      startAtTime = null;
      timeFormat = 'lll';
    } else {
      startAtTime = this.getTimeMinusMinutes(id);
    }
    this.setState({
      startAt: startAtTime,
      timeFormat,
    }, this.updateFirebaseRefs(startAtTime))
  }

  getTimeMinusMinutes(minutes) {
    return moment.utc().subtract(minutes, 'minutes').format();
  }

  handleDataPointClick(id, index) {
    console.log(Object.entries(this.state.websites[id].scores)[index][1]);
  }

  render() {
    return (
      <Display 
        state={this.state} 
        handleCheckBoxChange={this.handleCheckBoxChange}
        handleButtonClick={this.handleButtonClick}
        onDataPointClick={this.handleDataPointClick}
        handleMetricCheckBoxChange={this.handleMetricCheckBoxChange}
      />
    )
  }
}

export default Home;
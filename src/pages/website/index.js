import React, { Component } from 'react'
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import NavBar from '../../components/navBar';
import TimeOption from '../../components/timeOption';
import EnvironmentSection from '../../components/environmentSection';
import { withRouter } from "react-router";
import firebase from '../../firebase';


import Display from './display';

class Website extends Component {
  constructor(props){
    super(props);
    
    this.didChangeDuration = this.didChangeDuration.bind(this);
    this.getTimeMinusMinutes = this.getTimeMinusMinutes.bind(this);
    this.handleSnapshot = this.handleSnapshot.bind(this);
    this.removeFirebaseListeners = this.removeFirebaseListeners.bind(this);
    this.didStartRequest = this.didStartRequest.bind(this);
    this.didStopRequest = this.didStopRequest.bind(this);
    this.didChangeDate = this.didChangeDate.bind(this);
    this.calculateStatistics = this.calculateStatistics.bind(this);

    this.state = {
      startAt: this.getTimeMinusMinutes(60),
      date: new Date(),
      isLoading: false,
      dbRefStr: this.props.match.params.dbRefStr || '',
      dbRef: null,
      scores: [],
      stats: {
        avg: 0,
        median: 0,
      },
      selectedDurationIndex: 2,
      durationOptions: [
        {
          value: 15,
          display: "15m",
          timeFormat: 'LTS'
        },
        {
          value: 30,
          display: "30m",
          timeFormat: 'LTS'
        },
        {
          value: 60,
          display: "1hr",
          timeFormat: 'LTS'
        },
        {
          value: 240,
          display: "4hr",
          timeFormat: 'LTS'
        },
        {
          value: 1440,
          display: "24hr",
          timeFormat: 'LTS'
        }
      ]
    }
  }

  componentDidMount(){
    this.updateFirebaseRefs(this.state.startAt);
  }

  componentWillUnmount(){
    this.removeFirebaseListeners();
  }

  getTimeMinusMinutes(minutes) {
    return moment.utc().subtract(minutes, 'minutes').format();
  }

  removeFirebaseListeners() {
    if (this.state.dbRef) {
      this.state.dbRef()
    }
  }

  didStartRequest(){
    this.setState({
      isLoading: true,
    })
  }

  didStopRequest(){
    this.setState({
      isLoading: false,
    })
  }

  didChangeDate(e){
    const selectedDateOnly = moment(e).format('L')
    const startAt = moment(selectedDateOnly, "MM/DD/YYYY").subtract(1, 'days').utc().format();
    const endAt= moment(selectedDateOnly, "MM/DD/YYYY").utc().format();
    this.setState({
      startAt,
      endAt,
      date: moment(e).toDate()
    }, this.updateFirebaseRefs(startAt, endAt))
  }

  getMedian(values) {
    if (values.length === 0) return 0;
    values.sort(function(a,b){
      return a-b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
      return ((values[half]) * 100).toFixed(1);
    return (((values[half - 1] + values[half]) / 2.0) * 100).toFixed(1);
  }

  getAverage(data){
    return (data.reduce((a, b) => a + b) / data.length * 100).toFixed(1);
  }

  parsePerformanceScore(scores) {
    return scores.map(score => score.lighthouseResult.categories.performance.score);
  }

  calculateStatistics(scores) {
    const parsedScores = this.parsePerformanceScore(scores);
    const stats = {}
    stats.avg = this.getAverage(parsedScores);
    stats.median = this.getMedian(parsedScores);
    this.setState({
      stats,
    })
  }

  updateFirebaseRefs(startAt, endAt){
    const { dbRefStr } = this.state;
    this.removeFirebaseListeners();
    this.didStartRequest();
    let ref = {}
    if (!endAt) {
      ref = firebase.firestore().collection(dbRefStr)
      .orderBy("lighthouseResult.fetchTime")
      .startAt(startAt)
      .onSnapshot(this.handleSnapshot)
    } else {
      ref = firebase.firestore().collection(dbRefStr)
      .orderBy("lighthouseResult.fetchTime")
      .startAt(startAt)
      .endAt(endAt)
      .onSnapshot(this.handleSnapshot)
    }

    this.setState({
      dbRef: ref,
    });
  }

  handleSnapshot(querySnapshot) {
    this.didStopRequest();
    var scores = []
    querySnapshot.forEach(doc => {
      scores.push(doc.data());
    });
    this.setState({
      scores
    }, this.calculateStatistics(scores))
  }

  didChangeDuration(e) {
    const { durationOptions } = this.state;
    const index = parseInt(e.target.value);
    this.setState({
      selectedDurationIndex: index,
      date: new Date(),
    }, this.updateFirebaseRefs(this.getTimeMinusMinutes(durationOptions[index].value)))
  }

  render(){
    return (
     <Display
      state={this.state}
      didChangeDuration={this.didChangeDuration}
      didChangeDate={this.didChangeDate}
      calculateStatistics={this.calculateStatistics}
    />
    )
  }
}

export default withRouter(Website);


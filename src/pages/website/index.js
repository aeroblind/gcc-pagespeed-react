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

    this.state = {
      startAt: this.getTimeMinusMinutes(60),
      isLoading: false,
      dbRefStr: this.props.match.params.dbRefStr || '',
      dbRef: null,
      scores: [],
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

  updateFirebaseRefs(startTime){
    const { dbRefStr } = this.state;
    this.removeFirebaseListeners();
    this.didStartRequest();
    const ref = firebase.firestore().collection(dbRefStr)
      .orderBy("lighthouseResult.fetchTime")
      .startAt(startTime)
      .onSnapshot(this.handleSnapshot)
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
    })
  }

  didChangeDuration(e) {
    const { durationOptions } = this.state;
    const index = parseInt(e.target.value);
    this.setState({
      selectedDurationIndex: index
    }, this.updateFirebaseRefs(this.getTimeMinusMinutes(durationOptions[index].value)))
  }

  render(){
    return (
     <Display
      state={this.state}
      didChangeDuration={this.didChangeDuration}
    />
    )
  }
}

export default withRouter(Website);


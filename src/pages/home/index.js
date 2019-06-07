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
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.timeIsSelected = this.timeIsSelected.bind(this);
    this.updateWebsiteScore = this.updateWebsiteScore.bind(this);
    this.handleDevButtonClick = this.handleDevButtonClick.bind(this);

    this.state = {
      devMode: false,
      selectedDuration: 15,
      timeFormat: 'LTS',
      dateRange: {
        isActive: false,
        start: moment(new Date).format(),
        end: moment(new Date).format()
      },
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
      websites: {
        production: {
          id: 'production',
          displayName: 'BLINDS.COM',
          isGcc: true,
          dev: false,
          show: true,
          websites: [
            {
              id: 'bcomProd',
              show: true,
              score: 0,
              displayName: 'Home',
              url: 'www.blinds.com',
              dbRef: 'bcom-prod',
            },
            {
              id: 'bcomProdPlp',
              show: true,
              score: 0,
              displayName: 'PLP',
              url: 'www.blinds.com/c/wood-blinds/40',
              dbRef: 'bcom-prod-plp',
            },
            {
              id: 'bcomProdPip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'www.blinds.com/p/blindscom-2-premium-wood-blind/503426',
              dbRef: 'bcom-prod-pip',
            },
          ]
        },
        prodNoTags: {
          id: 'prodNoTags',
          displayName: 'BLINDS.COM - NO TAGS (USEDTM=FALSE)',
          dev: true,
          show: true,
          isGcc: true,
          websites: [
            {
              id: 'bcomProd',
              show: true,
              score: 0,
              displayName: 'Home',
              url: 'www.blinds.com/?usedtm=false',
              dbRef: 'bcom-prod-no-tags',
            },
            {
              id: 'bcomProdPlp',
              show: true,
              score: 0,
              displayName: 'PLP',
              url: 'www.blinds.com/c/wood-blinds/54/?usedtm=false',
              dbRef: 'bcom-prod-plp-no-tags',
            },
            {
              id: 'bcomProdPip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'www.blinds.com/p/blindscom-2-premium-wood-blind/503426/?usedtm=false',
              dbRef: 'bcom-prod-pip-no-tags',
            },
          ]
        },
        prodNoTagsWebFonts: {
          id: 'prodNoTagsWebFonts',
          displayName: 'BLINDS.COM - NO TAGS/WEB FONTS',
          dev: true,
          show: true,
          isGcc: true,
          websites: [
            {
              id: 'bcom-prod-no-tags-web-fonts',
              show: true,
              score: 0,
              displayName: 'Home',
              url: 'www.blinds.com/?nowebfonts=true&usedtm=false',
              dbRef: 'bcom-prod-no-tags-web-fonts',
            },
          ]
        },
        stage: {
          id: 'stage',
          displayName: 'BLINDS.COM - STAGE',
          dev: true,
          show: false,
          isGcc: true,
          websites: [
            {
              id: 'bcomStage',
              show: true,
              score: 0,
              displayName: 'Home',
              url: 'stage.autobahn.blinds.com',
              dbRef: 'bcom-stage',
            },
            {
              id: 'bcomStagePlp',
              show: true,
              score: 0,
              displayName: 'PLP',
              url: 'stage.autobahn.blinds.com/c/wood-blinds/40',
              dbRef: 'bcom-stage-plp',
            },
            {
              id: 'bcomStagePip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'stage.autobahn.blinds.com/p/blindscom-2-premium-wood-blind/503426',
              dbRef: 'bcom-stage-pip',
            },
          ]
        },
        development: {
          id: 'development',
          displayName: 'BLINDS.COM - DEV',
          dev: true,
          show: false,
          isGcc: true,
          websites: [
            {
              id: 'bcomDev',
              show: true,
              score: 0,
              displayName: 'Home',
              url: 'dev.autobahn.blinds.com',
              dbRef: 'bcom-dev',
            },
            {
              id: 'bcomDevPlp',
              show: true,
              score: 0,
              displayName: 'PLP',
              url: 'dev.autobahn.blinds.com/c/wood-blinds/40',
              dbRef: 'bcom-dev-plp',
            },
            {
              id: 'bcomDevPip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'dev.autobahn.blinds.com/p/blindscom-2-premium-wood-blind/503426',
              dbRef: 'bcom-dev-pip',
            },
          ]
        },
        lowes: {
          id: 'lowes',
          displayName: "LOWE'S*",
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'lowes-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'blinds.lowes.com/',
              dbRef: 'lowes-home',
            },
            {
              id: 'lowes-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'blinds.lowes.com/c/Custom-Wood-Blinds?limited=0&page=1&pageSize=18&sortCode=-Most%20Popular',
              dbRef: 'lowes-plp',
            },
            {
              id: 'lowes-pip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'blinds.lowes.com/product/detail.action?sku=Levolor-Real-Wood-Blinds&groupName=Wood-Blinds&xdata-width=24&xdata-height=36',
              dbRef: 'lowes-pip',
            },
          ]
        },
        selectBlinds: {
          id: 'selectBlinds',
          displayName: 'SELECT BLINDS*',
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'select-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'www.selectblinds.com',
              dbRef: 'select-home',
            },
            {
              id: 'select-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'www.selectblinds.com/wood-blinds.html',
              dbRef: 'select-plp',
            },
            {
              id: 'select-pip',
              show: true,
              score: 0,
              displayName: 'PIP',
              url: 'www.selectblinds.com/woodblinds/2-inch-premier-wood-blind.html',
              dbRef: 'select-pip',
            },
          ]
        },
        budgetBlinds: {
          id: 'budgetBlinds',
          displayName: 'BUDGET BLINDS*',
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'bb-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'budgetblinds.com',
              dbRef: 'bb-home',
            },
            {
              id: 'bb-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'budgetblinds.com/our-products/blinds/wood-blinds/',
              dbRef: 'bb-plp',
            }
          ]
        },
        blindsGalore: {
          id: 'blindsGalore',
          displayName: 'BLINDS GALORE*',
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'bg-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'www.blindsgalore.com',
              dbRef: 'bg-home',
            },
            {
              id: 'bg-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'www.blindsgalore.com/wood-blinds',
              dbRef: 'bg-plp',
            },
            {
              id: 'bg-pip',
              score: 0,
              show: true,
              displayName: 'PIP',
              url: 'www.blindsgalore.com/product/702199/blindsgalore-hardwood-blinds-slats',
              dbRef: 'bg-pip',
            }
          ]
        },
        stevesBlinds: {
          id: 'stevesBlinds',
          displayName: "STEVE'S BLINDS*",
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'steves-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'www.stevesblindsandwallpaper.com',
              dbRef: 'bg-home',
            },
            {
              id: 'steves-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'www.stevesblindsandwallpaper.com/blinds/search/?brand=steves-exclusive-collection&product_type=wood-blinds',
              dbRef: 'bg-plp',
            },
            {
              id: 'steves-pip',
              score: 0,
              show: true,
              displayName: 'PIP',
              url: 'www.stevesblindsandwallpaper.com/blinds/product/6952-steves-good-2-wood-blind',
              dbRef: 'steves-pip',
            }
          ]
        },
        blindster: {
          id: 'blindster',
          displayName: 'BLINDSTER*',
          dev: false,
          show: false,
          isGcc: false,
          websites: [
            {
              id: 'blindster-home',
              score: 0,
              show: true,
              displayName: 'Home',
              url: 'https://www.blindster.com',
              dbRef: 'blindster-home',
            },
            {
              id: 'blindster-plp',
              score: 0,
              show: true,
              displayName: 'PLP',
              url: 'https://www.blindster.com/wood-blinds/',
              dbRef: 'blindster-plp',
            },
            {
              id: 'blindster-pip',
              score: 0,
              show: true,
              displayName: 'PIP',
              url: 'https://www.blindster.com/wood-blinds/2-inch-wood-blinds/',
              dbRef: 'blindster-pip',
            }
          ]
        },
      },
      dbRefs: [],
    }
  }

  componentDidMount(){
    this.updateFirebaseRefs(this.state.selectedDuration);
  }

  updateFirebaseRefs(duration){
    
    const { websites } = this.state;
    const startTimeGcc = this.getTimeMinusMinutes(duration);
    const startTimeNonGcc = this.getTimeMinusMinutes(duration >= 1440 ? duration : 1440);

    Object.keys(websites).forEach((key) => {
      if (websites[key].show) {
        websites[key].websites.map(website => {
          const startTime = websites[key].isGcc ? startTimeGcc : startTimeNonGcc;
          const dbRef = firebase.firestore().collection(website.dbRef)
          this.setState({
            dbRefs: [...this.state.dbRefs, dbRef],
          });
          dbRef
            .orderBy("lighthouseResult.fetchTime")
            .startAt(startTime)
            .get()
            .then(snapshot => this.handleSnapshot(key, website.id, snapshot))
            .catch(err => {
              console.error(err);
            })
        })
      }
    })
  }

  calculateMedian(values) {
    if (values.length === 0) return 0;
    values.sort(function(a,b){
      return a-b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
      return values[half];
    return (values[half - 1] + values[half]) / 2.0;
  }

  updateWebsiteScore(env, id, score) {
    let cWebsites = Object.assign({}, this.state.websites)
    const index = cWebsites[env].websites.findIndex(website => website.id === id);
    cWebsites[env].websites[index].score = score;
    this.setState({
      websites: cWebsites
    })
  }

  handleSnapshot(key, id, snapshot) {
    if (snapshot.empty) {
      return;
    }
    var scores = []
    snapshot.forEach(doc => {
      scores.push(doc.data().lighthouseResult.categories.performance.score);
    })
    var median = this.calculateMedian(scores);
    var percentage = Math.floor(median * 100);
    this.updateWebsiteScore(key, id, percentage);
  }

  getTimeMinusMinutes(minutes) {
    return moment.utc().subtract(minutes, 'minutes').format();
  }

  handleVisibilityChange(id, show) {
    const cWebsites = Object.assign({}, this.state.websites);
    cWebsites[id].show = show;
    this.setState({
      websites: cWebsites,
    }, this.updateFirebaseRefs(this.state.selectedDuration))
  }

  handleTimeChange(e) {
    const durationInMinutes = parseInt(e.currentTarget.getAttribute("value"), 10);
    this.setState({
      selectedDuration: durationInMinutes,
    }, this.updateFirebaseRefs(durationInMinutes))
  }

  timeIsSelected(time) {
    return time === this.state.selectedDuration;
  } 

  handleDevButtonClick(e) {
    this.setState({
      devMode: !this.state.devMode,
    })
  }

  render() {
    return (
      <Display 
        state={this.state} 
        handleVisibilityChange={this.handleVisibilityChange}
        handleTimeChange={this.handleTimeChange}
        timeIsSelected={this.timeIsSelected}
        handleDevButtonClick={this.handleDevButtonClick}
      />
    )
  }
}

export default Home;
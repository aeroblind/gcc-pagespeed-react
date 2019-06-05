import React from 'react'
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import NavBar from '../../components/navBar';
import TimeOption from '../../components/timeOption';
import EnvironmentSection from '../../components/environmentSection';
import { Line, Scatter } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import WebPageCard from '../../components/webpageCard';


import "react-datepicker/dist/react-datepicker.css";


class DatePickerButton extends React.Component {

  render () {
    return (
      <button
        type="button"
        className="btn btn-secondary"
        onClick={this.props.onClick}>
        {this.props.value}
      </button>
    )
  }
}

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

const Display = ({ state, didChangeDuration, didChangeDate, didSelectDataPointAtIndex }) => {
  const {
    dbRefStr: displayName, 
    scores,
    selectedIndex,
    durationOptions,
    selectedDurationIndex,
    isLoading,
    date,
    stats,
    weightedAverage,
  } = state;

  const getGraphData = (label, scores) => {
    const labels = [];	
    const data = [];	
    Object.entries(scores).forEach(([_, score]) => {	
      labels.push(moment(score.lighthouseResult.fetchTime).format(durationOptions[selectedDurationIndex].timeFormat));	
      data.push(score.lighthouseResult.categories.performance.score);	
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

  const getElementAtEvent = (e) => {
    didSelectDataPointAtIndex(e[0]._index)
  }

  return (
    <div>
      <NavBar title="GCC Pagespeed Insights" isLoading={isLoading}/>
      <FlexBox padding="10px">
        <Container>
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {durationOptions[selectedDurationIndex].display}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
            {durationOptions.map((option, index) => {
              return (
                <button
                  key={index}
                  className="dropdown-item"
                  type="button"
                  value={index}
                  onClick={didChangeDuration}
                >
                  {option.display}
                </button>
              )
            })}
          </div>
        </Container>
        <Container>
          <DatePicker
              customInput={<DatePickerButton/>}
              selected={date}
              onChange={didChangeDate}
          />
        </Container>
      </FlexBox>
      <Container>
        <div style={{display: 'inline-block', margin: '8px'}}>
          <FlexBox>
            { Object.keys(stats).map( (key,index) => (
                <WebPageCard
                  key={index}
                  title={key.toUpperCase()}
                  score={stats[key]}
                />
                )
              )
            }
            
          </FlexBox>
        </div>
      </Container>
      <Container margin={'15px 0 0 0'}>	
        <Line	
          id={999}	
          data={getGraphData(displayName, scores)} 	
          options={options}
          getElementAtEvent={getElementAtEvent}
        />	
      </Container>
      <span style={{fontSize:"12px", marginLeft: "8px", color: 'darkGray'}}><i>*Updates every 5min</i></span>
      <Container padding="10px" style={{color: 'darkGray'}}>
        <Container padding="10px 0 20px 0">
          <span style={{fontSize:"26px", color: 'darkGray'}}>BREAKDOWN</span><span style={{fontSize:"12px", marginLeft: "8px", color: 'darkGray'}}><i>(Click on data points)</i></span>
        </Container>
          <table className="table">
          <thead>
            <tr style={{color: 'darkGray'}}>
              <th scope="col">Weight</th>
              <th scope="col">Metric</th>
              <th scope="col">Score</th>
              <th scope="col">Weighted Score</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">5</th>
              <td>Time To Interactive</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits.interactive.score * 100 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits.interactive.score * 100 * 5 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits.interactive.displayValue : '?' }</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Speed Index</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['speed-index'].score * 100 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['speed-index'].score * 100 * 4 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['speed-index'].displayValue : '?' }</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>First Contentful Paint</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-contentful-paint'].score * 100 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-contentful-paint'].score * 100 * 3 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-contentful-paint'].displayValue : '?' }</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>First CPU Idle</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-cpu-idle'].score * 100 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-cpu-idle'].score * 100 * 2 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-cpu-idle'].displayValue : '?' }</td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>First Meaningful Paint</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-meaningful-paint'].score * 100 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-meaningful-paint'].score * 100 * 1 : '?'}</td>
              <td>{ selectedIndex !== null ? scores[selectedIndex].lighthouseResult.audits['first-meaningful-paint'].displayValue : '?' }</td>
            </tr>
            <tr>
              <th scope="row"></th>
              <td>Weighted Average</td>
              <td>N/A</td>
              <td><b>{ selectedIndex !== null ? (weightedAverage * 100).toFixed(1) : '?' }</b></td>
              <td>N/A</td>
            </tr>
          </tbody>
        </table>
      </Container>
      
    </div>
  )
}

export default Display;

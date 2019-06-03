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

const Display = ({ state, didChangeDuration, didChangeDate }) => {
  const {
    dbRefStr: displayName,
    timeFormat, 
    scores,
    durationOptions,
    selectedDurationIndex,
    isLoading,
    date,
    stats,
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
              ))
            }
            
          </FlexBox>
        </div>
      </Container>
      <Container margin={'15px 0 0 0'}>	
        <Line	
          id={999}	
          data={getGraphData(displayName, scores)} 	
          options={options} 	
        />	
      </Container>
      <span style={{fontSize:"12px", marginLeft: "8px", color: 'darkGray'}}><i>*Updates every 5min</i></span>
    </div>
  )
}

export default Display;

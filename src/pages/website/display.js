import React from 'react'
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import NavBar from '../../components/navBar';
import TimeOption from '../../components/timeOption';
import EnvironmentSection from '../../components/environmentSection';
import { Line, Scatter } from 'react-chartjs-2';


import "react-datepicker/dist/react-datepicker.css";

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

const Display = ({ state, didChangeDuration }) => {
  const {
    dbRefStr: displayName,
    timeFormat, 
    scores,
    durationOptions,
    selectedDurationIndex,
    isLoading,
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
      <Container margin="10px">
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

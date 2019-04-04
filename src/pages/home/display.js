import React from 'react'
import { Line, Scatter } from 'react-chartjs-2';
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import Button from '../../components/styled/Button';
import ReactTable from "react-table";

import 'react-table/react-table.css'

const Display = ({state, handleCheckBoxChange, handleMetricCheckBoxChange, handleButtonClick, onDataPointClick}) => {

  const { bcomProd, bcomStage, bcomDev } = state.websites;
  const { timeFormat } = state;

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

  const createCheckboxes = () => {
    const elements = [];
    Object.keys(state.websites).forEach(key => {
      const style = {marginRight: '15px'}
      elements.push(
        <div key={key} style={style}>
          <input onChange={handleCheckBoxChange} id={key} type="checkbox" checked={state.websites[key].show} />
          <label htmlFor={key}>{state.websites[key].displayName}</label>
        </div>
      );
    })
    return elements;
  }

  const createMetricCheckboxes = () => {
    const elements = [];
    Object.keys(state.metrics).forEach(key => {
      const style = {marginRight: '15px'}
      elements.push(
        <div key={key} style={style}>
          <input onChange={handleMetricCheckBoxChange} id={key} type="checkbox" checked={state.metrics[key].show} />
          <label htmlFor={key}>{state.metrics[key].displayName}</label>
        </div>
      );
    })
    return elements;
  }

  const getGraphData = (label, scores) => {
    const labels = [];
    const data = [];
    Object.entries(scores).forEach(([_, score]) => {
      labels.push(moment(score.fetchTime).format(timeFormat));
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

  const getMetricsGraphData = (scores) => {
    console.log(scores);
    const data = [];
    const datasets = [];

    Object.entries(state.metrics).forEach(metric => {
      console.log(metric);
      if(metric[1].show) {
        const data = [];
        Object.entries(scores).forEach(([_, score], index) => {
          data.push({
            x: parseInt(moment(score.fetchTime).format('X')),
            y: score.metrics[metric[1].dataKey]/metric[1].factor,
          });
        });
        datasets.push(
          {
            label: metric[1].chartLabel,
            data,
            borderWidth: 1,
            showLine: true,
            fill: false,
            borderColor: metric[1].color
          }
        );
      }
    })

    console.log(datasets);
    return {
      datasets,
    };
  }

  const handleOnClick = (e) => {
    if (e.length === 0) return;
    const id = e[0]._chart.canvas.id;
    const index = e[0]._index;
    console.log(index);
    onDataPointClick(id, index)
  }

  return (
    <div>
      <Container boxShadow>
        <FlexBox>
            {createCheckboxes()}
        </FlexBox>
      <Container padding={'0'}>
        <FlexBox overflow="auto" padding={'20px 0 15px 0'}>
          <Button id="15" margin={'0 10px 0 0'} onClick={handleButtonClick}>15min</Button>          
          <Button id="30" margin={'0 10px 0 0'} onClick={handleButtonClick}>30min</Button>
          <Button id="60" margin={'0 10px 0 0'} onClick={handleButtonClick}>1 Hour</Button>
          <Button id="240" margin={'0 10px 0 0'} onClick={handleButtonClick}>4 Hours</Button>
          <Button id="1440" margin={'0 10px 0 0'} onClick={handleButtonClick}>24 Hours</Button>
          <Button id="all" margin={'0 10px 0 0'} onClick={handleButtonClick}>All</Button>
        </FlexBox>
      </Container>
      </Container>
      <div>
        {bcomProd.show &&
          <Container margin={'15px 0 0 0'}>
            <Line
              id="bcomProd"
              data={getGraphData(bcomProd.displayName, bcomProd.scores)} 
              options={options} 
              onElementsClick = {handleOnClick} />
          </Container>
        }
        {bcomStage.show &&
          <Container margin={'15px 0 0 0'}>
            <Line
              id="bcomStage"
              data={getGraphData(bcomStage.displayName, bcomStage.scores)} 
              options={options} 
              onElementsClick={handleOnClick}/>
          </Container>
        }
        {bcomDev.show &&
          <Container margin={'15px 0 0 0'}>
            <Line
              id="bcomDev"
              data={getGraphData(bcomDev.displayName, bcomDev.scores)}
              options={options}
              onElementsClick={handleOnClick}/>
          </Container>
        }
        <h2>Metrics (beta)</h2>
        <Container boxShadow>
          <FlexBox>
              {createMetricCheckboxes()}
          </FlexBox>
        </Container>
        <div>
        {bcomProd.show &&
          <Container margin={'15px 0 0 0'}>
            <h3>Prod</h3>
            <Scatter
              id="bcomProd"
              data={getMetricsGraphData(bcomProd.scores)} 
              onElementsClick = {handleOnClick} />
          </Container>
        }
        {bcomStage.show &&
          <Container margin={'15px 0 0 0'}>
            <h3>Stage</h3>
            <Scatter
              id="bcomStage"
              data={getMetricsGraphData(bcomStage.scores)} 
              onElementsClick = {handleOnClick} />
          </Container>
        }
        {bcomDev.show &&
          <Container margin={'15px 0 0 0'}>
          <h3>Dev</h3>
          <Scatter
            id="bcomDev"
            data={getMetricsGraphData(bcomDev.scores)} 
            onElementsClick = {handleOnClick} />
        </Container>
        }
        </div>

      </div>
    </div> 
  )
}

export default Display;


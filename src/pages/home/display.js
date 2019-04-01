import React from 'react'
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import Button from '../../components/styled/Button';

const Display = ({state, handleCheckBoxChange, handleButtonClick}) => {

  const { bcomProd, bcomStage, bcomDev } = state.websites;

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

  const getGraphData = (label, scores) => {
    const labels = [];
    const data = [];
    Object.entries(scores).forEach(([_, score]) => {
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

  return (
    <div>
      <Container boxShadow>
        <FlexBox>
            {createCheckboxes()}
        </FlexBox>
      <Container padding={'10px 0 10px 0'}>
        <FlexBox overflow="scroll" padding={'0 0 15px 0'}>
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
            <Line data={getGraphData(bcomProd.displayName, bcomProd.scores)} options={options} />
          </Container>
        }
        {bcomStage.show &&
          <Container margin={'15px 0 0 0'}>
            <Line data={getGraphData(bcomStage.displayName, bcomStage.scores)} options={options}/>
          </Container>
        }
        {bcomDev.show &&
          <Container margin={'15px 0 0 0'}>
            <Line data={getGraphData(bcomDev.displayName, bcomDev.scores)} options={options}/>
          </Container>
        }
      </div>
    </div> 
  )
}

export default Display;


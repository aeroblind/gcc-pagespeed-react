import React from 'react'
import moment from 'moment';
import Container from '../../components/styled/Container';
import FlexBox from '../../components/styled/FlexBox';
import NavBar from '../../components/navBar';
import TimeOption from '../../components/timeOption';
import EnvironmentSection from '../../components/environmentSection';


import "react-datepicker/dist/react-datepicker.css";

const Display = ({
  state,
  handleVisibilityChange,
  handleTimeChange,
  timeIsSelected,
}) => {

  const { websites } = state;

  return (
    <div>
      <NavBar title="GCC Pagespeed Insights"/>
      <Container padding="0px">
        <FlexBox overflowX="scroll" padding="0 0 5px 0">
          <TimeOption display="15m" value={15} onClick={handleTimeChange} selected={timeIsSelected(15)}/>
          <TimeOption display="30m" value={30} onClick={handleTimeChange} selected={timeIsSelected(30)}/>
          <TimeOption display="1hr" value={60} onClick={handleTimeChange} selected={timeIsSelected(60)}/>
          <TimeOption display="4hr" value={240} onClick={handleTimeChange} selected={timeIsSelected(240)}/>
          <TimeOption display="24hr" value={1440} onClick={handleTimeChange} selected={timeIsSelected(1440)}/>
        </FlexBox>
        <Container padding="0px">
          {Object.keys(websites).map((key, index) => {
              return (
                <EnvironmentSection
                  key={index}
                  show={websites[key].show}
                  id={websites[key].id}
                  title={websites[key].displayName}
                  websites={websites[key].websites}
                  handleVisibilityChange={handleVisibilityChange}
                />
              )
            })
          }
        </Container>
      </Container>
    </div>
  )
}

export default Display;


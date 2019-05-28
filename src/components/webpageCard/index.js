import React from 'react'
import FlexBox from '../styled/FlexBox';

const containerStyle = {
  minWidth: '200px', 
  height: '300px', 
  backgroundColor: 'rgb(250, 250, 250', 
  margin: '8px', 
  borderRadius: "10px", 
  overflow: "hidden"
}

const getPerformanceColor = (score) => {
  if (score < 50) {
    return 'red'
  } else if (score >= 50 && score < 90) {
    return 'orange'
  } else {
    return 'green'
  }
} 

const WebPageCard = ({title, score, url}) => {
  return (
      <FlexBox
        flexDirection="column"
        minWidth="150px"
        height="175px"
        backgroundColor="rgb(250, 250, 250)"
        margin="8px"
        borderRadius="10px"
        overflow="hidden"
      >
        <FlexBox
          flexGrow={0}
          justifyContent="center"
          alignItems="center"
          backgroundColor="whiteSmoke"
          color="darkGray"
        >
          <span>{title}</span>
        </FlexBox>
        <FlexBox
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
          color={getPerformanceColor(score)}
          fontSize="75px"
        >
          <span>{score}</span>
        </FlexBox>
        <FlexBox
          flexGrow={0}
          justifyContent="center"
          alignItems="center"
          color="darkGray"
          fontSize="12px"
          padding="5px"
        >
          <a href={`https://${url}`} target="_blank">Link</a>
        </FlexBox>
      </FlexBox>
  )
}

export default WebPageCard;
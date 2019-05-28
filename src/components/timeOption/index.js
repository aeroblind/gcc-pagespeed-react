import React from 'react'
import styled from 'styled-components';

// export default styled.button`
//   /* Adapt the colors based on primary prop */
//   background: ${props => props.primary ? "palevioletred" : "white"};
//   color: ${props => props.primary ? "white" : "palevioletred"};
//   min-width: 125px;
//   font-size: 1em;
//   margin: ${(props) => props.margin || '0'};
//   padding: 0.25em 1em;
//   border: 2px solid palevioletred;
//   border-radius: 3px;
// `;
const TimeOptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props.selected ? 'lightBlue' : 'white')};
  border-style: solid;
  border-width: 1px;
  border-color: darkGray;
  border-radius: 50%;
  min-width: 50px;
  min-height: 50px;
  margin: 8px;
  &:hover {
    background-color: whiteSmoke;
  }
`;

const TimeOption = ({ display, value, selected, onClick }) => {
  return (
    <TimeOptionContainer selected={selected} value={value} onClick={onClick}>
      <span><b>{display}</b></span>
    </TimeOptionContainer>
  )
}

export default TimeOption;
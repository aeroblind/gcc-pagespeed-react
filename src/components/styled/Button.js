import styled from 'styled-components';

export default styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};
  width: 125px;
  font-size: 1em;
  margin: ${(props) => props.margin || '0'};
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;
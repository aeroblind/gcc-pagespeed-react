import styled from 'styled-components';

export default styled.div`
  display: flex;
  overflow: ${props => props.overflow || 'hidden'};
  padding: ${props => props.padding || '0'};
`;
import styled from 'styled-components';

export default styled.div`
  display: flex;
  margin: ${props => props.margin || ""};
  height: ${props => props.height || ""};
  min-width: ${props => props.minWidth || ""};
  color: ${props => props.color || ""};
  font-size: ${props => props.fontSize || ""};
  justify-content: ${props => props.justifyContent || ""};
  align-items: ${props => props.alignItems || ""};
  overflow: ${props => props.overflow || 'hidden'};
  overflow-y:  ${props => props.overflowY || 'hidden'};
  overflow-x:  ${props => props.overflowX || 'hidden'};
  padding: ${props => props.padding || '0'};
  flex-wrap: ${props => props.flexWrap || "nowrap"};
  flex-direction: ${props => props.flexDirection || "row"};
  flex-grow: ${props => props.flexGrow || 0};  
  background-color: ${props => props.backgroundColor || ""};
  border-radius: ${props => props.borderRadius || ""};
  ::-webkit-scrollbar { 
    display: none; 
  }
`;
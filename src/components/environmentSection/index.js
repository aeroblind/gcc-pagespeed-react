import React from 'react'
import FlexBox from '../styled/FlexBox';
import Container from '../styled/Container';
import WebPageCard from '../webpageCard';

const EnvironmentSection = ({ id, title, show, websites = [], handleVisibilityChange }) => {
  const handleClick = (e) => {;
    const targetShow = e.target.getAttribute('aria-expanded') === 'true'
    handleVisibilityChange(id, targetShow);
  }

  const getClassName = () => {
    let className = ''
    if (show) {
      className = 'collapse show'
    } else {
      className = 'collapse'
    }
    return className;
  }

  return (
    <React.Fragment>
      <FlexBox
        backgroundColor="whiteSmoke"
        alignItems="center"
        color="darkGray"
        padding="10px"
      >
        <FlexBox flexGrow={1}>
          <span><b>{ title }</b></span>
        </FlexBox>
        <FlexBox flexGrow={1} flexDirection="row-reverse" padding="2px">
          <button
            id=""
            type="button"
            className="btn btn-outline-primary"
            data-toggle="collapse"
            data-target={`#env-section-${id}`}
            aria-expanded={show}
            aria-controls="collapseExample"
            onClick={handleClick}
          >
            {show ? "Hide" : "Show"}
          </button>
        </FlexBox>
      </FlexBox>
      <Container padding="0px" overflow="auto">
        <div className={getClassName()} id={`env-section-${id}`}>
          <div style={{display: 'inline-block', margin: '8px'}}>
            <FlexBox>
              { websites.map( (website, index) => {
                return (
                  <WebPageCard
                    key={index}
                    title={website.displayName}
                    score={website.score}
                    url={website.url}
                    dbRef={website.dbRef}
                  />
                )
              })}
            </FlexBox>
          </div>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default EnvironmentSection;
import React from 'react'

const NavBar = ({ title, devMode, handleDevButtonClick, isLoading = false }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">{ title }</a>
      { isLoading &&
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      }
      <ul className="navbar-nav ml-auto">
        { devMode !== undefined && 
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDevButtonClick}
          >
            Dev Mode: {devMode ? 'ON' : 'OFF'}
          </button>
        }
      </ul>
    </nav>
  )
}

export default NavBar;
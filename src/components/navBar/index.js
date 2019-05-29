import React from 'react'

const NavBar = ({ title, devMode, handleDevButtonClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">{ title }</a>
      <ul class="navbar-nav ml-auto">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          onClick={handleDevButtonClick}
        >
          Dev Mode: {devMode ? 'ON' : 'OFF'}
        </button>
      </ul>
    </nav>
  )
}

export default NavBar;
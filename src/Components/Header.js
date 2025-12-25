import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <header id='header'>
        <span id='main' onClick={this.props.onMainClick}>Main</span>
        <span id='videos'>Videos</span>
        <span id='upload'>Upload</span>
        <span id='' onClick={this.props.onSignUpClick}>Sign</span>   
      </header>
    );
  }
}

export default Header;
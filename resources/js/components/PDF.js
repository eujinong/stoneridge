import React, { Component } from 'react';

class PDF extends Component {
  render() {
    console.log()
    return (
      <iframe
        src={`${window.location.origin}` + this.props.filename}
        style={{
          height: '70vh',
          width: '100%'
        }}
      />
    );
  }
}

export default PDF;
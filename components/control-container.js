const React = require('react');
// const TextContainer = require('./text-container');
import TextContainer from './text-container';

class Exploratory extends React.Component {

  handleUpdate(e) {
    this.props.updateProps({
      value: e.target.value
    });
  }
  handleMouseIn() {
  }
  handleMouseOut() {
  }
  handleDrag(e) {

    console.log('drag')
    if (this.props.type === 'range') {
      this.props.updateProps({
        value: this.props.value + e.movementX / 500
      })
    }
  }
  render() {
    const { hasError, idyll, updateProps, children, selectedInput, ...props } = this.props;
    return (
      <div onMouseEnter={this.handleMouseIn.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)} onDrag={this.handleDrag.bind(this)} style={{padding: '2em auto'}}>
        <input onChange={this.handleUpdate.bind(this)} {...props} style={{padding: '2em auto'}} />
      </div>
    );
  }
}

module.exports = Exploratory;

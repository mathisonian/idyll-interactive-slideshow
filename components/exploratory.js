const React = require('react');
// const TextContainer = require('./text-container');
import TextContainer from './text-container';

class Exploratory extends React.Component {

  handleMouseIn(label) {
    return () => {
      console.log('setting next to ', label);
      this.props.updateProps({
        selectedDemo: label,
        noTransition: true
      })
    }
  }
  handleMouseOut() {
    return () => {
      this.props.updateProps({
        selectedDemo: '',
        noTransition: false
      })
    }
  }
  render() {
    const { hasError, idyll, updateProps, children, ...props } = this.props;
    return (
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        <div className="demo-block" style={{flex: '0 50%', width: '100%', height: '50vh'}}>A Few Exploratory!</div>
        <div onMouseEnter={this.handleMouseIn('vega-lite')} onMouseLeave={this.handleMouseOut()} className="demo-block demo" style={{flex: '0 50%', width: '100%', height: '50vh', border: 'solid 1px #fff', color: '#fff', background: '#222'}}>
          Vega Lite Chart
        </div>
        <div onMouseEnter={this.handleMouseIn('map')} onMouseLeave={this.handleMouseOut()} className="demo-block demo" style={{flex: '0 50%', width: '100%', height: '50vh', border: 'solid 1px #fff', color: '#fff', background: '#222'}}>
          Dynamic Map
        </div>
        <div onMouseEnter={this.handleMouseIn('filters')} onMouseLeave={this.handleMouseOut()} className="demo-block demo" style={{flex: '0 50%', width: '100%', height: '50vh', border: 'solid 1px #fff', color: '#fff', background: '#222'}}>
          CSS Filters
        </div>
      </div>
    );
  }
}

module.exports = Exploratory;

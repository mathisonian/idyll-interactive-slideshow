const React = require('react');

class CustomComponent extends React.Component {

  render() {
    const { hasError, idyll, updateProps, x, y, ...props } = this.props;
    return (
      <svg style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: '#fff'}} viewBox="0 0 1 1">
        <rect x={0} y={0} height={1} width={1} fill="#ddd" />
        <circle cx={x} cy={y} r={0.05} fill="blue" />
      </svg>
    );
  }
}

module.exports = CustomComponent;

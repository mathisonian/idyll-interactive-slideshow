const React = require('react');
// const TextContainer = require('./text-container');
import TextContainer from './text-container';

class Slide extends React.Component {
  render() {
    const { hasError, idyll, updateProps, children, ...props } = this.props;
    return (
      <div {...props} className="slide">
        <TextContainer idyll={idyll}>
          {children}
        </TextContainer>
      </div>
    );
  }
}

module.exports = Slide;

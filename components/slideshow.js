const React = require('react');
const { filterChildren, mapChildren } = require('idyll-component-children');

class CustomComponent extends React.Component {

  componentDidMount() {

    const { currentSlide, tag, children } = this.props;
    const slides = filterChildren(children, (c) => {
      return (c.type.name && c.type.name.toLowerCase() === 'slide');
    });
    this.props.updateProps({
      numSlides: slides.length
    });
    console.log('mounting');
    document.onkeydown = (e) => {
      console.log('keydowning');
      const { currentSlide, tag, children } = this.props;
      const slides = filterChildren(children, (c) => {
        return (c.type.name && c.type.name.toLowerCase() === 'slide');
      });
      console.log(e);
      switch (e.keyCode) {
        case 37:
          if (currentSlide > 0) {
            this.props.updateProps({
              currentSlide: currentSlide - 1
            })
          }
          break;
        case 38:
          // alert('up');
          break;
        case 39:
          if (currentSlide < slides.length - 1) {
            this.props.updateProps({
              currentSlide: currentSlide + 1
            })
          }
          break;
        case 40:
          // alert('down');
          break;
      }
    };
  }

  // getCurrentSlide() {
  //   const { currentSlide, tag, children } = this.props;
  //   const slides = filterChildren(children, (c) => {
  //     return (c.type.name && c.type.name.toLowerCase() === 'slide');
  //   });
  //   console.log('slides', slides);
  //   console.log('slide', slides[currentSlide]);
  //   return slides[currentSlide];
  // }

  render() {
    const { hasError, idyll, updateProps, children, currentSlide, ...props } = this.props;
    return (
      <div className="slideshow" style={{height: '100vh', background: '#222', color: '#fff', position: 'absolute', transform:`translateX(${-100 * currentSlide}vw)`}}>
        {children}
      </div>
    );
  }
}

module.exports = CustomComponent;


import TWEEN from 'tween.js';

module.exports = (ctx) => {

  // The context has loaded,
  // initial data is available
  ctx.onInitialize(() => {
    const initialState = ctx.data();



    // Once the context has been initialized,
    // you can use the ctx.update() method
    // to modify data
    // ctx.update({
    //    key: value
    // })

  })

  // The application has mounted in the browser,
  // the window object is available
  ctx.onMount(() => {

    let ws = new WebSocket('ws://localhost:8080');
    // ws.on('open', function open() {
    //   // ws.send('something');
    //   console.log('ws opened');
    // });

    // const commands = {
    //   NEXT: 'next',
    //   BACK: 'next',
    // }
    // const commandTimes = {

    // }
    // const animate = (key, value, time) => {
    //   let _tween = { value : ctx.data()[key] };
    //   new TWEEN.Tween(_tween)
    //     .to({value: value}, time === undefined ? 750 : time)
    //     .easing(TWEEN.Easing.Quadratic.InOut)
    //     .onUpdate(() => {
    //       const updated = {};
    //       updated[key] = _tween.value;
    //       ctx.update(updated);
    //     }).start();
    // }

    ws.onmessage = (e) => {
      console.log('Received ', e.data);
      const { currentSlide, numSlides, blur } = ctx.data();
      switch(e.data.toLowerCase().trim()) {
        case 'next':
          if (currentSlide < numSlides - 1) {
            ctx.update({
              currentSlide: currentSlide + 1
            })
          }
          break;
        case 'previous':
          console.log('received previous')
          if (currentSlide > 0) {
            console.log('decrementing');
            ctx.update({
              currentSlide: currentSlide - 1
            })
          }
          break;
        case 'enhance':
          // animate('blur', 0);
          ctx.update({
            blur: 0
          })
          break;
        case 'filter':
          // animate('blur', 10);
          ctx.update({
            blur: 10
          })
          break;
      }
    };
    // Tell TWEEN to start listening for animations
    // const listenForAnimations = () => {
    //   const update = TWEEN.update();
    //   requestAnimationFrame(listenForAnimations);
    // };
    // listenForAnimations();

  })

  // An update has been triggered,
  // arguments contain only modified data
  ctx.onUpdate((newData) => {

  })

}
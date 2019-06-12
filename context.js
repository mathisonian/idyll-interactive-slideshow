
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

    const nextMap = {
      'vega-lite': 5,
      'map': 6,
      'other': 7,
    }

    ws.onmessage = (e) => {
      // console.log('Received ', e.data);
      try {
        // console.log(e.data.name)
        const parsed = JSON.parse(e.data);
        const { currentSlide, numSlides, blur, zoom } = ctx.data();

        console.log('got dat parse!!', parsed);

        if (parsed.command === 'next') {
          const { selectedDemo } = ctx.data();
          console.log('current selected demo', selectedDemo);
          if (selectedDemo.trim() === '') {
            if (currentSlide < numSlides - 1) {
              ctx.update({
                currentSlide: currentSlide + 1
              })
            }
          } else {
            console.log('setting current slide to ', nextMap[selectedDemo]);
            ctx.update({
              currentSlide: nextMap[selectedDemo],
              selectedDemo: ''
            })
          }
        }
        else if (parsed.command === 'previous') {
          if (currentSlide > 4) {
            ctx.update({
              noTransition: true,
              currentSlide: 4
            });
            return;
          }
          if (currentSlide > 0) {
            console.log('decrementing');
            ctx.update({
              currentSlide: currentSlide - 1
            })
          }
        }
        else if (parsed.command === 'show') {
          ctx.update({
            lat: parsed.lat,
            lon: parsed.lon,
          })
        }

        return;
      } catch(e) {

      }
      const { currentSlide, numSlides, blur, zoom } = ctx.data();
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
        case 'zoom way in':
          // animate('blur', 10);
          ctx.update({
            zoom: 12
          })
          break;
        case 'zoom way out':
          // animate('blur', 10);
          ctx.update({
            zoom: 3
          })
          break;
        case 'zoom in':
          // animate('blur', 10);
          ctx.update({
            zoom: zoom + 1
          })
          break;
        case 'zoom out':
          // animate('blur', 10);
          ctx.update({
            zoom: zoom - 1
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


module.exports = (ctx) => {

  ctx.onMount(() => {

    let ws = new WebSocket('ws://localhost:8080');

    const nextMap = {
      'vega-lite': 5,
      'map': 6,
      'other': 7,
    }

    ws.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        const { currentSlide, numSlides, blur, zoom } = ctx.data();
        if (parsed.command === 'next') {
          const { selectedDemo } = ctx.data();
          if (selectedDemo.trim() === '') {
            if (currentSlide < numSlides - 1) {
              ctx.update({
                currentSlide: currentSlide + 1
              })
            }
          } else {
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
          if (currentSlide > 0) {
            ctx.update({
              currentSlide: currentSlide - 1
            })
          }
          break;
        case 'enhance':
          ctx.update({
            blur: 0
          })
          break;
        case 'filter':
          ctx.update({
            blur: 10
          })
          break;
        case 'zoom way in':
          ctx.update({
            zoom: 12
          })
          break;
        case 'zoom way out':
          ctx.update({
            zoom: 3
          })
          break;
        case 'zoom in':
          ctx.update({
            zoom: zoom + 1
          })
          break;
        case 'zoom out':
          ctx.update({
            zoom: zoom - 1
          })
          break;
      }
    };

  })

  // An update has been triggered,
  // arguments contain only modified data
  ctx.onUpdate((newData) => {

  })

}
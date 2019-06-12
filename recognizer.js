
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = [];


let gesturesEnabled = false;
let voiceEnabled = false;

let mouseState = 'up';
// TODO - setup 2 different WS servers??

var robot = require("robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);
var screenSize = robot.getScreenSize();


console.log(screenSize);

/**
 * Capture input from Kinect / gestures
 */
wss.on('connection', function connection(ws) {
  console.log('client connected');
  clients.push(ws);
  ws.on('message', function incoming(message) {

    const data = JSON.parse(message);
    // console.log('received: %s', message);
    // console.log(gesturesEnabled);
    if (data.name === 'highlight') {
      // console.log('passing')
      // console.log('move mouse', data.x * screenSize.width, data.y * screenSize.height);
      if (gesturesEnabled) {
        robot.moveMouse(screenSize.width - (data.x + 0.25) * screenSize.width, screenSize.height - data.y * screenSize.height);
      }
      // clients.forEach((ws) => {
      //   ws.send(message);
      // })
    } else if (data.name === 'click' && gesturesEnabled) {

      if (mouseState !== data.direction) {
        robot.mouseToggle(data.direction);
        mouseState = data.direction;
      }
    }
  });

  ws.send('hello world');
});

/**
 * Capture input from serial port
 */

 // Require the serialport node module
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
SerialPort.list((err, ports) => {
  // console.log(ports)

  console.log(ports[1].comName)
  // const port = new SerialPort(ports[1].comName, { baudRate: 9600 })
  const port = new SerialPort(ports[1].comName)

  const parser = port.pipe(new Readline({ delimiter: '\n' }))
  parser.on('data', (data) => {
    console.log(data.trim());
    if (data.trim() === 'BUTTON_A') {
      voiceEnabled = !voiceEnabled;

      startRecording();
    } else if (data.trim() === 'BUTTON_B') {
      gesturesEnabled = !gesturesEnabled;
    } else if (data.trim() === 'BUTTON_C') {
      gesturesEnabled = false;
      if (mouseState !== 'up') {
        robot.mouseToggle('up');
        mouseState = 'up';
      }
      clients.forEach((ws) => {
        ws.send(JSON.stringify({ command: 'previous' }));
      })
    } else if (data.trim() === 'BUTTON_D') {
      gesturesEnabled = false;
      if (mouseState !== 'up') {
        robot.mouseToggle('up');
        mouseState = 'up';
      }
      clients.forEach((ws) => {
        ws.send(JSON.stringify({ command: 'next' }));
      })
    }
  })

})

const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBG1dQiIUELMK8lsIaPOlYqPOXtrymRZ7M', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


const startRecording = () => {

let lastGuess;
// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {

    const results = data.results[0] && data.results[0].alternatives[0] ? data.results[0].alternatives[0].transcript : null;
    console.log('Results:', results);
    if (results) {
      // if (results === lastGuess) {
      //   return;
      // }
      if (results.toLowerCase().trim().indexOf('show') === 0) {
        // Using callback
        geocoder.geocode(results.toLowerCase().trim().replace('show', '').trim(), function(err, res) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(res);
          clients.forEach((ws) => {
            ws.send(JSON.stringify({
              command: 'show',
              lat: +res[0].latitude,
              lon: +res[0].longitude,
            }));
          })
        });
      } else {
        clients.forEach((ws) => {
          ws.send(results);
        })
      }
      lastGuess = results;
    }
  }).on('end', () => {
    console.log('Stream end');
    // startRecording();
  });
  // Start recording and send the microphone input to the Speech API
  record
    .start(
    //   {
    //   sampleRateHertz: sampleRateHertz,
    //   // threshold: 0.5,
    //   // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    //   // verbose: true,
    //   recordProgram: 'rec', // Try also "arecord" or "sox"
    //   // silence: '0.1',
    // }
    )
    .on('error', console.error)
    .pipe(recognizeStream);
}


console.log('Listening, press Ctrl+C to stop.');


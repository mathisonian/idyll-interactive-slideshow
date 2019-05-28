
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = [];


wss.on('connection', function connection(ws) {
  console.log('client connected');
  clients.push(ws);
  // ws.on('message', function incoming(message) {
  //   console.log('received: %s', message);
  // });

  // ws.send('something');
});

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
  interimResults: true, // If you want interim results, set this to true
};


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
      if (results === lastGuess) {
        return;
      }
      clients.forEach((ws) => {
        ws.send(results);
      })
      lastGuess = results;
    }
  }).on('end', () => {
    console.log('Stream end');
    startRecording();
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


startRecording();
console.log('Listening, press Ctrl+C to stop.');


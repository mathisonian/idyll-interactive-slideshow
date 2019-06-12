/*
  State change detection (edge detection)

  Often, you don't need to know the state of a digital input all the time, but
  you just need to know when the input changes from one state to another.
  For example, you want to know when a button goes from OFF to ON. This is called
  state change detection, or edge detection.

  This example shows how to detect when a button or button changes from off to on
  and on to off.

  The circuit:
  - pushbutton attached to pin 2 from +5V
  - 10 kilohm resistor attached to pin 2 from ground
  - LED attached from pin 13 to ground (or use the built-in LED on most
    Arduino boards)

  created  27 Sep 2005
  modified 30 Aug 2011
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/ButtonStateChange
*/

// this constant won't change:
const int  buttonPinA = 0;    // the pin that the pushbutton is attached to
const int  buttonPinB = 1;    // the pin that the pushbutton is attached to
const int  buttonPinC = 2;    // the pin that the pushbutton is attached to
const int  buttonPinD = 3;    // the pin that the pushbutton is attached to

// Variables will change:
int buttonPushCounter = 0;   // counter for the number of button presses
int buttonStateRawA = 0;         // current state of the button
int buttonStateRawB = 0;         // current state of the button
int buttonStateRawC = 0;         // current state of the button
int buttonStateRawD = 0;         // current state of the button

bool buttonStateA = 0;         // current state of the button
bool buttonStateB = 0;         // current state of the button
bool buttonStateC = 0;         // current state of the button
bool buttonStateD = 0;         // current state of the button

bool lastButtonStateA = 0;     // previous state of the button
bool lastButtonStateB = 0;     // previous state of the button
bool lastButtonStateC = 0;     // previous state of the button
bool lastButtonStateD = 0;     // previous state of the button

void setup() {
  // initialize the button pin as a input:
  pinMode(buttonPinA, INPUT);
  pinMode(buttonPinB, INPUT);
  pinMode(buttonPinC, INPUT);
  pinMode(buttonPinD, INPUT);
  
  // initialize serial communication:
  Serial.begin(9600);
}


void loop() {
  // read the pushbutton input pin:
  buttonStateRawA = analogRead(buttonPinA);
  buttonStateRawB = analogRead(buttonPinB);
  buttonStateRawC = analogRead(buttonPinC);
  buttonStateRawD = analogRead(buttonPinD);

  buttonStateA = buttonStateRawA > 1000;
  buttonStateB = buttonStateRawB > 1000;
  buttonStateC = buttonStateRawC > 1000;
  buttonStateD = buttonStateRawD > 1000;

  

  // compare the buttonState to its previous state
  if (buttonStateA != lastButtonStateA) {
    if (buttonStateA) {
      Serial.println("BUTTON_A");    
    }
  }
  if (buttonStateB != lastButtonStateB) {
    if (buttonStateB) {
      Serial.println("BUTTON_B");
    }
  }
  if (buttonStateC != lastButtonStateC) {
    if (buttonStateC) {
      Serial.println("BUTTON_C");
    }
  }
  if (buttonStateD != lastButtonStateD) {
    if (buttonStateD) {
      Serial.println("BUTTON_D");
    }
  }

  // save the current state as the last state, for next time through the loop
  lastButtonStateA = buttonStateA;
  lastButtonStateB = buttonStateB;
  lastButtonStateC = buttonStateC;
  lastButtonStateD = buttonStateD;
  
  delay(50);
}

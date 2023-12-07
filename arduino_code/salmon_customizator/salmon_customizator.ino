#include <ArduinoJson.h>

// the current and previous reading from the input pin
// int buttonState;
// int lastButtonState = LOW;

// unsigned longs because the time will quickly become a bigger number than can be stored in an int

// the last time the output pin was toggled
// unsigned long lastDebounceTime = 0;
// // the debounce time; increase if the output flickers
// unsigned long debounceDelay = 10;



void setup() {
  // Initialize Serial port
  Serial.begin(9600);
}

void loop() {
  // potentiometers
  // set the size of the obj
  // StaticJsonDocument<96> doc0;
  // doc0["type"] = "data";

  // JsonObject values = doc0.createNestedObject("values");
  // // you can send to the computer through serial only values between 0 and 255, so divide by 4 to stay in range
  // values["hue"] = analogRead(A0) / 4;
  // values["saturation"] = analogRead(A1) / 4;
  // values["lightness"] = analogRead(A2) / 4;
  // values["texture"] = analogRead(A3) / 4;
  // values["scaleX"] = analogRead(A4)/4;
  // values["scaleY"] = analogRead(A5)/4;

  // serialise potentiometers values
  // serializeJson(doc0, Serial);

  // buttons
  // read the state of the switch into a local variable:
  // int reading = digitalRead(7);

  // StaticJsonDocument<40> doc1;
  // doc1["type"] = "button";

  // JsonObject state = doc1.createNestedObject("state");
  // state["next"].set(digitalRead(7));
  // state["ok"].set(digitalRead(6));
  // state["prev"].set(digitalRead(5));

  // // if the switch changed, due to noise or pressing:
  // if (reading != lastButtonState) {
  //   // reset the debouncing timer
  //   lastDebounceTime = millis();
  // }

  // if ((millis() - lastDebounceTime) > debounceDelay) {
  //   // whatever the reading is at, it's been there for longer than the debounce delay, so take it as the actual current state

  //   // if the button state has changed:
  //   if (reading != buttonState) {
  //     buttonState = reading;

  //     // only send json if the new button state is HIGH
  //     if (digitalRead(7) == HIGH || digitalRead(6) == HIGH || digitalRead(6) == HIGH) {
  //       serializeJson(doc1, Serial);
  //     }
  //   }
  // }


  StaticJsonDocument<72> doc;  // 88 in tot.
  doc["type"].set("DATA");

  if (digitalRead(7) == HIGH) {
    doc["type"].set("next");
  } else if (digitalRead(6) == HIGH) {
    doc["type"].set("ok");
  } else if (digitalRead(5) == HIGH) {
    doc["type"].set("back");
  }

  JsonObject values = doc.createNestedObject("values");
  values["hue"].set(analogRead(A0) / 4);
  values["saturation"].set(analogRead(A1) / 4);
  values["lightness"].set(analogRead(A2) / 4);
  // values["texture"].set(analogRead(A3) / 4);
  // values["scaleX"].set(analogRead(A4) / 4);
  // values["scaleY"].set(analogRead(A5) / 4);

  values["next"].set(digitalRead(7));
  values["ok"].set(digitalRead(6));
  values["back"].set(digitalRead(5));

  serializeJson(doc, Serial);
  Serial.println("");

  // save the reading. Next time through the loop, it'll be the lastButtonState:
  // lastButtonState = reading;

  // wait for n milliseconds to let the adc settle down
  delay(150);
}
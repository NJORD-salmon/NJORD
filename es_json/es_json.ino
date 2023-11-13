#include <ArduinoJson.h>

void setup() {
  // Initialize Serial port
  Serial.begin(9600);

}

void loop() {
  // set the size of the obj 
  StaticJsonDocument<32> doc;
  JsonObject obj = doc.to<JsonObject>();
  // the doc contains {}

  // you can send to the computer only values between 0 and 255, so divide by 4 to stay in range
  int pot_hue = analogRead(A0)/4;
  int pot_sat = analogRead(A1)/4;
  int pot_light = analogRead(A2)/4;

  doc["hue"].set(pot_hue);
  doc["saturation"].set(pot_sat);
  doc["lightness"].set(pot_light);
  serializeJsonPretty(doc, Serial);

  // wait for n milliseconds to let the adc settle down
  delay(150);
}
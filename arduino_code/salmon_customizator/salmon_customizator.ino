#include <ArduinoJson.h>

void setup() {
  // Initialize Serial port
  Serial.begin(9600);
}

void loop() {
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

  // wait for n milliseconds to let the adc settle down
  delay(150);
}
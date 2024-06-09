#include <Wire.h>
#include <WiFi.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Firebase_ESP_Client.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Create a TinyGPS++ object
TinyGPSPlus gps;

// Create a HardwareSerial object to communicate with the GPS module
HardwareSerial SerialGPS(1); // Use Serial1 for ESP32
HardwareSerial SerialPort(2);

// Insert your network credentials
#define WIFI_SSID "Eja"
#define WIFI_PASSWORD "12345678"

#define API_KEY "AIzaSyCPi3bXFQrElpQiI-F9SW02zseaOhPLJyU"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "fahrezayunanda@gmail.com"
#define USER_PASSWORD "Daftarqwe123@"

// Insert RTDB URLefine the RTDB URL
#define DATABASE_URL "https://bikegps-e1f2f-default-rtdb.asia-southeast1.firebasedatabase.app"

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid;

// Variable locations
float lat;
float lgt;

// Variables to save database paths
String databasePath;
String latPath;
String lgtPath;
// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 2000;

String terminal;
String receivedData;
String temp;

// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}


// Write integer values to the database
void sendFloat(String path, float value){
  if (Firebase.RTDB.setFloat(&fbdo, path.c_str(), value)){
    Serial.print("Writing value: ");
    Serial.print (value);
    Serial.print(" on the following path: ");
    Serial.println(path);
    Serial.println("PASSED");
    Serial.println("PATH: " + fbdo.dataPath());
    Serial.println("TYPE: " + fbdo.dataType());
  }
  else {
    Serial.println("FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
}

void setup() {
  SerialPort.begin(115200, SERIAL_8N1, 18, 19);
  Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);
  delay(1000);

  initWiFi();

  //Firebase setUp
  // Assign the api key (required)
  config.api_key = API_KEY;

  // Assign the user sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase authen and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  // Update database path
  databasePath = "/Bike/" + "1" + "/";

  // Update database path for sensor readings
  latPath = databasePath + "latitude";
  lgtPath = databasePath + "longitude";

}

void loop() {

  //Read location
  if (SerialGPS.available()) {
    while (SerialGPS.available()) {
      if (gps.encode(SerialGPS.read())) {
        // If valid data is available, print the GPS information
        if (gps.location.isValid()) {
          lat = gps.location.lat();
          lgt = gps.location.lng();
          Serial.print("Latitude: ");
          Serial.println(lat);
          Serial.print("Longitude: ");
          Serial.println(lgt);
        } else {
          Serial.println("GPS data not valid yet.");
        }
      }
    }
  }

  //Send to database
  if (Firebase.ready()){
    sendFloat(latPath, lat);
    sendFloat(lgtPath, lgt);
  }
  delay(1000);
}
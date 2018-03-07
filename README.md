# Chirp Connect React Native Starter Project

This starter project isn't completely off the shelf, you will need to sign up to the [Chirp Admin Centre](https://admin.chirp.io/sign-up),
and download both iOS and Android SDK's from the [downloads](https://admin.chirp.io/downloads) page.

## Setup

1. Clone the project

    `git clone https://github.com/chirp/chirp-connect-react-native-starter`

2. Install node_modules

    `cd chirp-connect-react-native-starter`

    `yarn install`

3. Download iOS and Android SDKs

4. Open `./ios/ReactNativeStarter.xcodeproj` and copy `ChirpConnect.framework` into the project by dragging and dropping.

5. Open the `./android` directory in Android Studio, and create a directory at `app/libs`.
Drag and drop the `chirp-connect-vx.x.aar` file to the libs directory.
Ensure the .aar reference has the same version number as that of the .aar file.

6. Update `local.properties` file with your own `sdk.dir` location.

7. Enter your application key and secret into `App.js`.

    `const key = 'YOUR_CHIRP_APPLICATION_KEY';`

    `const secret = 'YOUR_CHIRP_APPLICATION_SECRET';`

8. Run the demo.

    `react-native run-ios`

    `react-native run-android`

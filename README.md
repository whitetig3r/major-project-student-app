# Sound Shinobi

This starter project isn't completely off the shelf, you will need to sign up to the [Chirp Dashboard](https://admin.chirp.io/sign-up),
and download both iOS and Android SDK's from the [downloads](https://admin.chirp.io/downloads) page.

## Setup

1. Install node_modules

    `cd chirp-connect-react-native-starter`

    `yarn install`

2. Download iOS and Android SDKs

3. Open `./ios/ReactNativeStarter.xcodeproj` and copy `ChirpConnect.framework` into the project by dragging and dropping.

4. Open the `./android` directory in Android Studio, and create a directory at `app/libs`.
Drag and drop the `chirp-connect-vx.x.aar` file to the libs directory.
Ensure the .aar reference has the same version number as that of the .aar file.

5. Update `local.properties` file with your own `sdk.dir` location.

6. Enter your application key and secret into `App.js`.

    `const key = 'YOUR_CHIRP_APPLICATION_KEY';`

    `const secret = 'YOUR_CHIRP_APPLICATION_SECRET';`

7. Follow instructions on [RNFirebase](https://rnfirebase.io/) for instructions on integrating Firebase.

8. Run the demo.

    `react-native run-ios` (*Works only on macOS)

    `react-native run-android`

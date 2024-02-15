A small [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Patient Label Recognition

This app represents a short demonstration of using [Google MLKit's Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition/v2) to automatically extract patient information from hospital labels.

## Installation
Clone the repository and navigate to the root project folder in the terminal.
For iOS, install the necessary [CocoaPods](https://cocoapods.org) by running:

```bash
cd ios && pod install
```

## Running 
For trying out the application while tampering around with the code, you may want to start **Metro**, the JavaScript bundler that ships with React Native.
It will enable instant reflection of code changes while you're running the app in the simulator or on a phyiscal device.

To start Metro, run the following command from the root of the project:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

Let Metro Bundler run in its own terminal. Open a **new terminal** at the root project folder. Run the following command to start the **Android** or **iOS** app:

### For Android

```bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

The app should be automatically installed on a running iOS or Android simulator (or connected phyisical device).
Alternatively you can also run it directly from within Android Studio and Xcode, respectively.

### Troubleshooting
For running the app on iOS, you may need to open XCode once and change the developer team identification.

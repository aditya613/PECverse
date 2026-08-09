export default {
  "expo": {
    "name": "PECverse",
    "slug": "pecverse-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "pecconnectmobile",
    "userInterfaceStyle": "automatic",
    "ios": {
      "bundleIdentifier": "in.edu.pec.connect",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "in.edu.pec.connect",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#0c0822"
      },
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0c0822",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.543780041775-5ofelpimp1c25edcer4et4g23ndsou84"
        }
      ],
      "expo-sharing",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#208AEF"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "999365ed-edd9-4525-9357-1edf51149ed7"
      }
    },
    "runtimeVersion": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/999365ed-edd9-4525-9357-1edf51149ed7"
    }
  }
};

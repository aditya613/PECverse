export default {
  "expo": {
    "name": "PECverse",
    "slug": "pecverse-mobile",
    "version": "1.0.2",
    "orientation": "default",
    "icon": "./assets/images/icon.png",
    "scheme": "pecconnectmobile",
    "userInterfaceStyle": "automatic",
    "ios": {
      "bundleIdentifier": "in.edu.pec.connect",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSPhotoLibraryUsageDescription": "PECverse needs access to your photo library to attach photos of lost or found items on campus.",
        "NSCameraUsageDescription": "PECverse needs access to your camera to take photos of lost or found items on campus.",
        "NSPhotoLibraryAddUsageDescription": "PECverse needs permission to save images to your photo library."
      }
    },
    "android": {
      "package": "in.edu.pec.connect",
      "versionCode": 2,
      "resizeableActivity": true,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#0c0822"
      },
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      "predictiveBackGestureEnabled": false,
      "permissions": [
        "NOTIFICATIONS",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/icon.png"
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
        "expo-image-picker",
        {
          "photosPermission": "PECverse needs access to your photo library to attach photos of lost or found items.",
          "cameraPermission": "PECverse needs access to your camera to take photos of lost or found items."
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#208AEF"
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
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
    "runtimeVersion": "1.0.1",
    "updates": {
      "url": "https://u.expo.dev/999365ed-edd9-4525-9357-1edf51149ed7"
    }
  }
};

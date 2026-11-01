# IronMind Fitness — Android + iPhone starter app

A React Native + Expo starter project for a bodybuilding motivation app. The same codebase targets Android and iOS.

## Included in this first version
- Dark, black-and-red fitness interface
- Daily motivational quote
- Daily workout checklist with completion state
- Starter bodyweight workout plan
- Body-weight progress log
- Water-glass counter
- Fitness goal selection
- Local persistence on the device with AsyncStorage

## Run it locally
1. Install Node.js (LTS) on your computer.
2. Extract this ZIP and open a terminal in this folder.
3. Run `npm install`.
4. Run `npx expo start`.
5. Install **Expo Go** on your Android phone or iPhone and scan the QR code. For iOS, follow Expo's current device instructions; some development options may require a Mac.
6. For an Android emulator use `npm run android`. For an iOS simulator, use `npm run ios` on macOS with Xcode installed.

## Build installable apps
This project is source code, not an already signed APK or App Store package. To create release builds, configure Expo Application Services (EAS), Apple Developer signing for iOS, and Android signing, then build with EAS Build. App Store / Play Store submission and accounts are separate steps.

## Before public launch
- Add onboarding, privacy policy, account/data deletion flows if accounts are introduced.
- Add tests, accessibility checks, error handling and device testing.
- Workout suggestions are general examples; adapt for ability, equipment and health. Stop if you feel sharp pain or become unwell.
- Progress data is stored locally on the device in this starter. It is not synced to a server.

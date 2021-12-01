# HLS Video App

<img src="/screenshots/Screenshot1.jpg" width="150"><img width="50"><img src="/screenshots/Screenshot2.jpg"  width="150"><img width="50"><img src="/screenshots/Screenshot3.jpg" width="150"><img width="50"><img src="/screenshots/Screenshot4.jpg" width="150"> 

## About 
It is a sample react native based video application implementing Apple HLS for streaming videos via FFMPEG. This was majorly built to learn react native ecosystem particularly for Android (b'cos I have that only). 

## Prerequisites
You need to setup the following on your machine:
1. React Native for Android (NodeJs & Android Studio with ADB tools)
2. FFMPEG

PS: Once installed, the following commands should be accessible: npm, adb and ffmpeg through your terminal(windows powershell/cmdline on windows)
## Installation
### Server Installation
```bash
  cd server
  npm install
```

### React Native App Installation
```bash
  cd native-app/MyApp
  npm install
```

## Steps to run
1. Enable developer mode and USB debugging on your android device
2. Connect your device to laptop over wired(USB) connection
3. Open 2 terminal windows at root of project
4. Terminal 1:
    ```bash
        cd server
        npm start
    ```
5. Terminal 2:
    ```bash
        cd native-app/MyApp
        adb reverse tcp:3000 tcp:3000
        npm run android
    ```
## How to operate
1. Click the + sign
2. Choose any of the .mp4 videos
3. Click Select
4. Wait for video to upload and transmux into sd and hd versions
5. The new video will be shown on the UI. You can choose Auto, SD or HD and play the video
6. You can repeat steps 1-5 to keep adding more videos
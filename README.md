# Slack Clone

> A React Slack Clone

This is my version of Slack, a message application. It includes authentication, messageing, channels, etc. I used for firebase as the backend for this application, other than that i tried to customize the frontend of this application, I used material-ui for styling, real-time messaging, for a reponsive layout used RC-Drawers, etc.

---

# Quick Start 🚀

### Add a your firebase config in the firebase file in the src folder with the following

```
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  //Add your firebase config here!
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
```

### Install dependencies

```bash
npm install
```

### Build for production

```bash
npm run build
```

## Features

- Alerts when someone is typing in one of the channels
![Screen Recording 2022-01-22 at 2 04 08 AM](https://user-images.githubusercontent.com/67803385/150597126-0fb24f40-664a-41ac-8cfd-f6b35087596c.gif)

- Change Avatar
![Screenshot 2022-01-22 at 2 16 05 AM](https://user-images.githubusercontent.com/67803385/150597889-c15e42d2-418a-48dc-957d-5ffa8bc8867b.png)

- Emoji Picker, Loading Skelton and much more small features to give the users a better experience!
![Screen Recording 2022-01-22 at 2 18 32 AM](https://user-images.githubusercontent.com/67803385/150598287-2a51bf12-5e18-4376-802e-58658a74bf60.gif)

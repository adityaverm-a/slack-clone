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


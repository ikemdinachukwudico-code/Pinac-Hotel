
/* ============================================================
   FIREBASE CONFIG — PASTE YOUR OWN KEYS HERE
   1. Go to https://console.firebase.google.com
   2. Create project (e.g. "pinec-hotel")
   3. Project settings > Your apps > Web app > register
   4. Copy the config object below
   ============================================================ */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

/* Leave as null until you paste keys — site works in DEMO mode instead */
let db = null;
try {
  if (!firebaseConfig.apiKey.includes("PASTE")) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase connected");
  } else {
    console.warn("Firebase not configured — running in DEMO mode (bookings saved to browser only).");
  }
} catch (e) {
  console.error("Firebase init failed:", e);
}

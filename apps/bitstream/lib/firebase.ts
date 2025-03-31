import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQNS4KlwiWNoiq12WJWDTlBkKwb5SUpPQ",
  authDomain: "bitstream-1743441693984.firebaseapp.com",
  projectId: "bitstream-1743441693984",
  storageBucket: "bitstream-1743441693984.firebasestorage.app",
  messagingSenderId: "107389401787",
  appId: "1:107389401787:web:f99096a2ada06a5825879e",
  measurementId: "G-D03BSTCCQQ",
};

initializeApp(firebaseConfig);
export const db = getFirestore();

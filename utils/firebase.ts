import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCPLt5ggL_5oq3Yq3VBqv6TlFOe_psre4",
  authDomain: "days-73488.firebaseapp.com",
  projectId: "days-73488",
  storageBucket: "days-73488.appspot.com",
  messagingSenderId: "686242609593",
  appId: "1:686242609593:web:3485f8ba1da32fa4721e68",
  measurementId: "G-HHJ971XJMR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
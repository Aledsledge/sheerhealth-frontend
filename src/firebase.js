 
import { initializeApp } from "firebase/app";

import { getAuth} from "firebase/auth";
import{getFirestore} from 'firebase/firestore';
import{getStorage} from 'firebase/storage'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUbDaON5ofbU_9KwLfEZvGzHRqmb9fE4Y",
  authDomain: "sheer-health.firebaseapp.com",
  projectId: "sheer-health",
  storageBucket: "sheer-health.appspot.com",
  messagingSenderId: "172612524559",
  appId: "1:172612524559:web:8b5cc81a2199e76b3fe17a",
  measurementId: "G-JHHMBB6ES0"
};

  export const app = initializeApp(firebaseConfig);
  
 
  export const auth = getAuth(app);
  export const db = getFirestore(app)
 export const storage = getStorage(app)


 

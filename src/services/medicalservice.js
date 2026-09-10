import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

// Function to get all medical services from Firestore
export const getAllMedicalServices = async () => {
  const servicesSnapshot = await getDocs(collection(db, "services"));
  const services = servicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return services;
};

// Function to update a medical service in Firestore by ID
export const updateMedicalService = async (id, data) => {
  try {
    const serviceRef = doc(db, "services", id);
    await updateDoc(serviceRef, data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Function to delete a medical service in Firestore by ID
export const deleteMedicalService = async (id) => {
  try {
    const serviceRef = doc(db, "services", id);
    await deleteDoc(serviceRef);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

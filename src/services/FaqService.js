import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const faqCollectionRef = collection(db, "faq");

// Function to retrieve all FAQs
export const getAllFaqs = async () => {
  try {
    const querySnapshot = await getDocs(faqCollectionRef);
    const faqs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return faqs;
  } catch (error) {
    console.error("Error retrieving FAQs:", error);
    throw new Error("Failed to retrieve FAQs.");
  }
};

// Function to add a new FAQ
export const addNewFaq = async (faqData) => {
  try {
    const newFaqRef = await addDoc(faqCollectionRef, {
      ...faqData,
      timestamp: serverTimestamp(),
    });
    return newFaqRef.id;
  } catch (error) {
    console.error("Error adding new FAQ:", error);
    throw new Error("Failed to add new FAQ.");
  }
};

// Function to update an existing FAQ
export const updateFaq = async (faqId, updatedData) => {
  try {
    await updateDoc(doc(faqCollectionRef, faqId), {
      ...updatedData,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw new Error("Failed to update FAQ.");
  }
};

// Function to delete a FAQ by its ID
export const deleteFaq = async (faqId) => {
  try {
    await deleteDoc(doc(faqCollectionRef, faqId));
    return true;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw new Error("Failed to delete FAQ.");
  }
};

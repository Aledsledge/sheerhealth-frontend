import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, getDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  title: "",
  description: "",
};

const AddFaq = ({ user }) => {
  const [form, setForm] = useState(initialState);
  const [progress, setProgress] = useState(null);
  const { id } = useParams();
  const { title, description } = form;
  const navigate = useNavigate();

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "faq", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description) {
      if (!id) {
        try {
          await addDoc(collection(db, "faq"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("FAQ created successfully");
        // Redirect to home page after successful submission
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await updateDoc(doc(db, "faq", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("FAQ updated successfully");
          // Redirect to home page after successful update
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }
  };

  return (
    <div className="container mx-auto my-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="py-4 px-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {id ? "Update Faq" : "Create Faq"}
          </h2>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Question"
                name="title"
                value={title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <textarea
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Answer"
                value={description}
                name="description"
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <button
                className={`px-4 py-2 bg-indigo-500 text-white rounded-md focus:outline-none hover:bg-indigo-600 ${
                  progress !== null && progress < 100 ? "opacity-50 pointer-events-none" : ""
                }`}
                type="submit"
                disabled={progress !== null && progress < 100}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddFaq;

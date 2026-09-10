import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import RichTextEditor from "../components/RichTextEditor";
import { slugify } from "../utility";
import { resolveUniqueSlug } from "../services/blog.service";

const initialState = {
  title: "",
  trending: "no",
  category: "",
  description: "",
  contentHtml: "",
  comments: [],
  likes: []
};

const categoryOption = [
  "General Health and Wellness",
  "Disease Prevention and Management",
  "Medical Research and Breakthroughs",
  "Mental Health and Psychology",
  "Women's Health",
  "Men's Health",
  "Children's Health",
  "Aging and Geriatrics",
  "Nutrition and Diet",
  "Fitness and Exercise",
  "Traditional Chinese Medicine",
  "Medical Technology and Innovation",
  "Medical Procedures and Treatments",
  "Pharmaceutical Updates",
  "Healthcare Industry News",
  "Medical Ethics and Legal Issues",
  "Health Policy and Advocacy",
  "Medical Education and Training",
  "Patient Stories and Experiences",
  "Health Tips and Advice"
  // Other categories...
];

const AddEditBlog = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const { title, category, trending, description, contentHtml } = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image uploaded to Firebase successfully");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentHtmlChange = (html) => {
    setForm((prev) => ({ ...prev, contentHtml: html }));
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && title && description && trending) {
      if (!id) {
        try {
          // New post: always generate a slug. resolveUniqueSlug checks
          // Firestore for the base slug and any existing -2/-3/... variants,
          // so two posts with the same (or very similar, once slugified)
          // title get distinct URLs automatically instead of silently
          // colliding.
          const baseSlug = slugify(title);
          const slug = await resolveUniqueSlug(baseSlug, null);
          await addDoc(collection(db, "blogs"), {
            ...form,
            slug,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog created successfully");
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const { timestamp, ...rest } = form;
          // Existing post: keep its current slug (a title edit shouldn't
          // silently break an already-shared /slug link). Only generate one
          // if this post somehow doesn't have one yet, excluding its own id
          // from the collision check so re-saving without a title change
          // doesn't append a pointless -2 to itself.
          const slug = rest.slug || (await resolveUniqueSlug(slugify(title), id));
          await updateDoc(doc(db, "blogs", id), {
            ...rest,
            slug,
            updatedAt: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog updated successfully");
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }

    navigate("/cblog");
  };

  return (
    <div className="container mx-auto my-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="py-4 px-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {id ? "Update Blog" : "Create Blog"}
          </h2>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Title"
                name="title"
                value={title}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <select
                value={category}
                onChange={onCategoryChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              >
                <option>Please select category</option>
                {categoryOption.map((option, index) => (
                  <option value={option || ""} key={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt (shown on cards & link previews)
              </label>
              <textarea
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Short summary for blog cards and social link previews"
                value={description}
                name="description"
                rows={3}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Content
              </label>
              <RichTextEditor value={contentHtml} onChange={handleContentHtmlChange} />
            </div>
            <div className="mb-4">
              <input
                type="file"
                className="block"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="mt-6">
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-md focus:outline-none hover:bg-indigo-600"
                type="submit"
                disabled={progress !== null && progress < 100}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditBlog;

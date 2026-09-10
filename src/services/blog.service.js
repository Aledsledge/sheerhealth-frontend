import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    updateDoc,
    orderBy,
    where,
  } from "firebase/firestore";
  import { db } from "../firebase";

export const getBlogBySlug = async (slug) => {
    try {
        const blogRef = collection(db, "blogs");
        const slugQuery = query(blogRef, where("slug", "==", slug), limit(1));
        const snapshot = await getDocs(slugQuery);
        if (snapshot.empty) return null;
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
        console.log("BLOG SERVICE getBlogBySlug: ", err);
        return null;
    }
};

// Returns a slug guaranteed not to collide with any OTHER post's slug -
// checks the exact base first, then base-2, base-3, ... until one is free.
// excludeId lets updating a post that already owns `baseSlug` keep it
// instead of treating a match against itself as a collision.
export const resolveUniqueSlug = async (baseSlug, excludeId) => {
    let candidate = baseSlug;
    let suffix = 1;
    while (suffix < 50) {
        const existing = await getBlogBySlug(candidate);
        if (!existing || existing.id === excludeId) {
            return candidate;
        }
        suffix += 1;
        candidate = `${baseSlug}-${suffix}`;
    }
    // Pathological case (50 posts sharing one title) - fall back to a short
    // random suffix rather than looping forever.
    return `${baseSlug}-${Date.now().toString(36)}`;
};

export const getBlog = async (blogId)=>{
    try{
        const docRef = doc(db, "blogs", blogId);
       return (await getDoc(docRef)).data();
    }catch(err){
        console.log("BLOG SERVICE getBlog: ",err)
        return null
    }
};
export const getRecentBlogs= async (blogId)=>{
    try{
        const blogRef = collection(db, "blogs");
        const recentBlogs = query(
          blogRef,
          orderBy("timestamp", "desc"),
          limit(5)
          );
          const docSnapshot = await (await getDocs(recentBlogs)).docChanges;
          return docSnapshot.docs
    }catch(err){
        console.log("BLOG SERVICE getRecentBlogs: ",err)
        return []
    }
};

export const getBlogs= async ()=>{
    try{
        const docRef = doc(db, "blogs");
       return await (await getDocs(docRef)).docChanges;
    }catch(err){
        console.log("BLOG SERVICE getBlogs: ",err)
        return []
    }
};
export const getRelatedBlogs= async (tags)=>{
    try{
    const blogRef = collection(db, "blogs");
    const relatedBlogsQuery = query(
      blogRef,
      where("tags", "array-contains-any", tags.length?tags:['hi'], limit(3))
    );
    const relatedBlogSnapshot = await (await getDocs(relatedBlogsQuery)).docChanges;
    const relatedBlogs = [];
    relatedBlogSnapshot.forEach((doc) => {
      relatedBlogs.push({ id: doc.id, ...doc.data() });
    });
        const docRef = doc(db, "blogs");
        return (await getDocs(docRef)).docChanges;
    }catch(err){
        console.log("BLOG SERVICE getRelatedBlogs: ",err)
        return []
    }
};

export const updateBlog= async (blogId,blogData)=>{
    try{
        const { timestamp, ...rest } = blogData;
        await updateDoc(doc(db, "blogs", blogId), {...rest, updatedAt: serverTimestamp()});
        return true
    }catch(err){
        console.log("BLOG SERVICE updateBlog: ",err)
        return null
    }
};
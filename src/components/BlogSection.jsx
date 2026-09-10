import React from "react";
import { Link } from "react-router-dom";
import { excerpt, formatDate } from "../utility";
import logo from "../assets/images/logo1.png";

const BlogSection = ({ id, slug, title, description, category, imgUrl, userId, author, timestamp, handleDelete }) => {
  const userData = localStorage.getItem("USER");
  let currentUser = null;
  let isAdmin = false;
  if (userData) {
    currentUser = JSON.parse(userData);
    isAdmin = currentUser.isAdmin;
  }
  // Canonical SEO-friendly URL once a post has a slug, falling back to the
  // legacy /detail/:id form for the rare post that somehow doesn't yet.
  const detailPath = slug ? `/${slug}` : `/detail/${id}`;

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hover-blogs-img">
          <div className="blogs-img">
            <img
              src={imgUrl || logo}
              alt={title}
              className="w-full aspect-[16/9] object-cover rounded"
              width="640"
              height="360"
              loading="lazy"
              decoding="async"
            />
            <div></div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h6 className="category catg-color">{category}</h6>
            <Link to={detailPath}>
              <h2 className="text-2xl font-bold py-2">{title}</h2>
            </Link>
            <p className="text-gray-500">
              <span className="author">{author}</span> -&nbsp;
              {formatDate(timestamp)}
            </p>
            <p className="short-description">
              {excerpt(description, 120)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Link to={detailPath}>
              <button className="btn-primary" >Read More</button>
            </Link>
            {isAdmin && (
              <div className="flex items-center">
                <i
                  className="ri-delete-bin-line text-red-500 cursor-pointer"
                  style={{ margin: "15px" }}
                  size="2x"
                  onClick={() => handleDelete(id)}
                ></i>
                <Link to={`/update/${id}`}>
                  <i
                    className="ri-edit-box-line cursor-pointer"
                    size="2x"
                  ></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

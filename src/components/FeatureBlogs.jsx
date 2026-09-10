import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";


const FeatureBlogs = ({ blogs, title }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="blog-heading text-start pt-3 py-2 mb-4">{title}</div>
      {blogs?.map((item) => (
        <div
          className="flex items-center gap-4 pb-3 cursor-pointer"
          key={item.id}
          onClick={() => navigate(item.slug ? `/${item.slug}` : `/detail/${item.id}`)}
        >
          <img
            src={item.imgUrl}
            alt={item.title}
            className="most-popular-img w-20 h-20 object-cover rounded flex-shrink-0"
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col justify-center">
            <div className="text-start text-lg font-semibold">{item.title}</div>
            <div className="text-start text-gray-500 text-sm">
              {item.timestamp?.toDate ? item.timestamp.toDate().toDateString() : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

FeatureBlogs.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      timestamp: PropTypes.object.isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
};

export default FeatureBlogs;

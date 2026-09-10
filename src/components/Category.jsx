import React from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Category = ({ catgBlogsCount }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Category</h2>
      <div className="link-widget">
        <ul>
          {catgBlogsCount?.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={`/CBlog?category=${encodeURIComponent(item.category)}`}
                className="flex items-center text-gray-700 hover:text-indigo-500"
              >
                <span className="mr-2">{item.category}</span>
                <span className="text-gray-500">({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Category.propTypes = {
  catgBlogsCount: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

export default Category;

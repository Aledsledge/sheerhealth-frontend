import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { getAllFaqs, deleteFaq } from '../../services/FaqService';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FaqItem = () => {
  const userData = localStorage.getItem('USER');
  let currentUser = null;
  let isAdmin = false;
  if (userData) {
    currentUser = JSON.parse(userData);
    isAdmin = currentUser.isAdmin;
  }

  const [faqs, setFaqs] = useState([]);
  const [openStates, setOpenStates] = useState({});

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const fetchedFaqs = await getAllFaqs();
      setFaqs(fetchedFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Handle error
    }
  };

  const toggleAccordion = (id) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this FAQ?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteFaq(id);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while deleting the FAQ');
    }
  };

  return (
    <div>
      {faqs.map((faq) => (
        <div key={faq.id} className="p-4 lg:p-6 bg-white rounded-lg shadow-md mb-6 cursor-pointer">
          <div className="flex items-center justify-between" onClick={() => toggleAccordion(faq.id)}>
            <h4 className="text-lg font-semibold text-gray-800">{faq.title}</h4>
            <div className={`text-purple-600 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center`}>
              {openStates[faq.id] ? <AiOutlineMinus size={24} /> : <AiOutlinePlus size={24} />}
            </div>
          </div>

          {openStates[faq.id] && (
            <div className="mt-4">
              <p className="text-base text-gray-600 text-left leading-relaxed">{faq.description}</p>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center">
              <i
                className="ri-delete-bin-line text-red-500 cursor-pointer"
                style={{ margin: '15px' }}
                size="2x"
                onClick={() => handleDelete(faq.id)}
              ></i>
              <Link to={`/updateFaq/${faq.id}`}>
                <i className="ri-edit-box-line cursor-pointer" size="2x"></i>
              </Link>
            </div>
          )}
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default FaqItem;

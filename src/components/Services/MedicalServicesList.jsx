// MedicalServicesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { getAllMedicalServices } from '../../services/medicalservice';
import useAdmin from '../../utils/hooks';
import ServiceCard from './ServiceCard';

const MedicalServicesList = () => {
  const [medicalServices, setMedicalServices] = useState([]);

  useEffect(() => {
    // Load the medical services from the service when the component mounts
    loadMedicalServices();
  }, []);

  const loadMedicalServices = async () => {
    try {
      const servicesData = await getAllMedicalServices();
      setMedicalServices(servicesData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {medicalServices.map((service, index) => (
        <div key={service.id}>
          <ServiceCard service={service} index={index + 1} />
        </div>
      ))}
    </div>
  );
};

export default MedicalServicesList;

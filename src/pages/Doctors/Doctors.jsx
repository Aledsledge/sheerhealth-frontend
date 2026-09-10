import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doctors = () => {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [appointmentDate, setAppointmentDate] = useState('');

  const handlePatientNameChange = (e) => {
    setPatientName(e.target.value);
  };

  const handlePatientEmailChange = (e) => {
    setPatientEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };



  const handleAppointmentDateSelection = (e) => {
    setAppointmentDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send email using email.js
    const emailServiceId = 'service_bd81ll6';
    const emailTemplateId = 'template_3j6fown';
    const emailUserId = '3cJ9NRtWPLdcAyOjp';

    const templateParams = {
      patientName,
      patientEmail,
      phoneNumber,
      
      appointmentDate,
    };

    emailjs
      .send(emailServiceId, emailTemplateId, templateParams, emailUserId)
      .then((response) => {
        console.log('Email sent successfully!', response);
        // Show success toast
        toast.success('Appointment scheduled successfully!', {
          position: 'top-right',
          autoClose: 2000, // Close the toast after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        // Show error toast
        toast.error('Failed to schedule appointment!', {
          position: 'top-right',
          autoClose: 2000, // Close the toast after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

    // Reset the form
    setPatientName('');
    setPatientEmail('');
    setPhoneNumber('');
   
    setAppointmentDate('');
  };

  return (
   <section>
    <div className="container">
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Doctor Appointment</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name:
              </label>
              <input
                type="text"
                id="patientName"
                value={patientName}
                onChange={handlePatientNameChange}
                className="mt-1 form-input"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700">
                Patient Email:
              </label>
              <input
                type="email"
                id="patientEmail"
                value={patientEmail}
                onChange={handlePatientEmailChange}
                className="mt-1 form-input"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="mt-1 form-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                Select an Appointment Date:
              </label>
              <input
                type="date"
                id="appointmentDate"
                value={appointmentDate}
                onChange={handleAppointmentDateSelection}
                className="mt-1 form-input"
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
   </section>
  );
};

export default Doctors;

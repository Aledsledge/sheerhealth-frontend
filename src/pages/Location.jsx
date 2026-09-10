import React from 'react';
import Iframe from 'react-iframe';

const Location = () => {
  return (
    <section>
        <div className="container items-center justify-center">
        <div className="p-6 flex flex-col md:flex-row items-center md:justify-center">
      {/* Contact Information and Map Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4"> Address</h2>
          <p className="text-gray-600 mb-2">
          6-12 1st Cross DV block ,
            <br />
            rt nagar Bengaluru 560032 , Karnataka
          </p>
          <p className="text-gray-600 mb-2">Phone:  +91 8050863265</p>
          <p className="text-gray-600 mb-2">Email: sheerhealthh@gmail.com</p>
          <p className="text-gray-600 mb-2">Email: drfurkaan@sheerhealth.in</p>
          <p className="text-gray-600 mb-2">Email: drshimeiyan@sheerhealth.in</p>
         
        </div>
        {/* Map Section */}
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
          <Iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3887.1658247070627!2d77.59290451482258!3d13.025109990820834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDAxJzMwLjQiTiA3N8KwMzUnNDIuMyJF!5e0!3m2!1sen!2sin!4v1690035568742!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: '0' }}
          />
        </div>
      </div>
    </div>
        </div>
    </section>
 
  );
};

export default Location;

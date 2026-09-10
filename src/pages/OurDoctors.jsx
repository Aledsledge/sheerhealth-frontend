import React from 'react'
import DoctorList from '../components/Doctors/DoctorList'

const OurDoctors = () => {
  return (
    <section>
      <div className="container">
      <div className="lg:w-[470px] mx-auto">
          <h2 className='heading text-center'>

            Our Great Doctors
          </h2>
          <p className='text_para text-center'> World-class care for everyone. Our health system offers unmatched,
            expert health care.</p>
        </div>
        <DoctorList/>

      </div>
    </section>
  )
}

export default OurDoctors
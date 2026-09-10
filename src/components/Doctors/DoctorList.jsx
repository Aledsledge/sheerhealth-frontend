
import React from 'react' // eslint-disable-line no-unused-vars

import DoctorCard from "./DoctorCard"
import { doctors } from './../../assets/data/doctors';


const DoctorList = () => {
  return (
    <div className=" items-center justify-center lg:items-center lg:justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
    {doctors.map((doctor) => (
      <DoctorCard  key={doctor.id} doctor={doctor} />
    ))}
  </div>
  )
}

export default DoctorList
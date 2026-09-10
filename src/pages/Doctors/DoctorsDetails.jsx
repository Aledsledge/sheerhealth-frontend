import React from 'react' // eslint-disable-line no-unused-vars
import ServiceList from '../../components/Services/ServiceList'
const DoctorsDetails = () => {
  return (
    <section>
    <div className="container">
      <div className="xl:w-[470px] mx-auto">
        <h2 className='heading text-center '>Our Medical Services</h2>
        <p className='text_para text-center'> World-class care for everyone. Our health system offers</p>
      </div>
      <ServiceList />
    </div>
    </section>
  )
  
}

export default DoctorsDetails
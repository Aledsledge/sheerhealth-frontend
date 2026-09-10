import React from 'react' // eslint-disable-line no-unused-vars
import icon01 from '../assets/images/icon01.png'
import icon02 from '../assets/images/icon02.png'
import icon03 from '../assets/images/icon03.png'
// interim placeholder image (reusing the hero image) until a real photo is supplied for this section
import featureImg from '../assets/images/hero-img01.png'
import videoIcon from '../assets/images/video-icon.png'
import avatarIcon from '../assets/images/avatar-icon.png';

import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import ScrollReveal from '../components/ScrollReveal'
import CinematicHero from '../components/Hero/CinematicHero'
import TwoSystemsSection from '../components/TwoSystems/TwoSystemsSection'
import About from '../components/About/About'
import ServiceList from '../components/Services/ServiceList'
import DoctorList from '../components/Doctors/DoctorList'
// interim placeholder image (reusing the hero image) until a real photo is supplied for this section
import faqImg from '../assets/images/hero-img01.png'
import FaqList from '../components/Faq/FaqList'

const Home = () => {
  return <>
    <CinematicHero />





    {/* hero end */}

    <TwoSystemsSection />

    <section>
      <div className="container">
        <div className="lg:w-[470px] mx-auto">
          <h2 className='heading text-center'>

            Providing The Best Medical Services
          </h2>
          <p className='text_para text-center'> 
          World class care for everyone. Our health system offers unmatched expert health care.</p>
        </div>

        <div className="grid grid-cols-1 md:grod-cols-2  lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          <ScrollReveal className="py-[30px] px-5" delay={0}>
            <div className="flex items-center justify-center">
              <img src={icon01} alt='' />
            </div>

            <div className="mt-[30px]">
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Find a Doctor</h2>
              <p className='text-[16px] leading-7 text-headingColor font-[400] mt-4 text-center'>

              World class care for everyone. Our health system offers unmatched expert health care. From the lab to the clinic
              </p>
              <Link to='/OurDoctors' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]  mt-30px] mx-auto flex items-center
               justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5' />
              </Link>
            </div>

          </ScrollReveal>
          <ScrollReveal className="py-[30px] px-5" delay={150}>
            <div className="flex items-center justify-center">
              <img src={icon02} alt='' />
            </div>

            <div className="mt-[30px]">
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Find a Location</h2>
              <p className='text-[16px] leading-7 text-headingColor font-[400] mt-4 text-center'>
              World class care for everyone. Our health system offers unmatched expert health care. From the lab to the clinic
              </p>
              <Link to='/Location' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]  mt-30px] mx-auto flex items-center
               justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5' />
              </Link>
            </div>

          </ScrollReveal>
          <ScrollReveal className="py-[30px] px-5" delay={300}>
            <div className="flex items-center justify-center">
              <img src={icon03} alt='' />
            </div>

            <div className="mt-[30px]">
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Book An Appointment</h2>
              <p className='text-[16px] leading-7 text-headingColor font-[400] mt-4 text-center'>
              World class care for everyone. Our health system offers unmatched expert health care. From the lab to the clinic
              </p>
              <Link to='/Appoinment' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]  mt-30px] mx-auto flex items-center
               justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5' />
              </Link>
            </div>

          </ScrollReveal>
        </div>
      </div>

    </section>
    {/** about section */}

    <About />

    {/** about end */}

    {/**services section */}
    <section id="services">
      <div className="container">
        <div className="xl:w-[470px] mx-auto">
          <h2 className='heading text-center'>Our Medical Services</h2>
          <p className='text_para text-center'> World class care for everyone. Our health system offers</p>
        </div>
        <ServiceList />
      </div>
    </section>
    {/**services end */}

    {/** FEATUR */}
    <section>
      <div className="container">
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <div className="max-w-xl xl:w-[670px]">
            <h2 className="heading">Get Virtual Treatment <br /> Anytime
            </h2>
            <ul className="pl-4">
              <li className="text_para">
                1. Schedule Appointment Directly.
              </li>
              <li className="text_para">
                2. Contact Your Physician Here.
              </li>
              <li className="text_para">
                3. View our Physician Who Are Accepting New Patients, Use The
                Online Scheduling Tool.
              </li>
              <li className="text_para">
                (Coming soon)
              </li>
            </ul>
            <Link to='/'>
              <button type="button" className="btn-primary mt-[20px]">Learn More</button>

            </Link>
          </div>
          <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0 ">
            <img src={featureImg} className='w-3/4' alt=''/>
            <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2
             pb-3 lg:px-4 lg:pb-[26px] rounded-[10px] ">
              <div className="flex item-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <p className=' text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]'>
                    Tue,24
                  </p>
                  <p className=' text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]'>
                    10:00
                  </p>
                </div>
                <span className='w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px]
                 lg:py-3 lg:px[9px]'>
                  <img src={videoIcon} alt=''/>
                 </span>
              </div>
              <div className="w-[65px]  lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg;px-[10px] text-[8px] leading[-8px]
               leading-[-8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4 rounded-full">
                Consultation
               </div>

               <div className="flex items-center gao-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                <img src={avatarIcon} alt=''/>
                <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leadingg-[22px] font-[700] text-headingColor"></h4>
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
    {/**FEATURE END */}

    {/**doctors section */}

    <section>
      <div className="container">
      <div className="lg:w-[470px] mx-auto">
          <h2 className='heading text-center'>

            Our Doctors
          </h2>
          <p className='text_para text-center'> 
          World class care for everyone. Our health system offers unmatched expert health care.</p>
        </div>
        <DoctorList/>

      </div>
    </section>
   
   {/**faq section */}

   <section>
    <div className="container">
      <div className="flex justify-between gap-[50px] lg:gap-0">
        <div className="w-1/2 hidden md:block self-start sticky top-[100px]">
          <img src={faqImg} alt="" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="heading">
            FAQ
          </h2>
          <FaqList/>
        </div>
      </div>
    </div>
   </section>
      {/**faq end */}



  </>
}

export default Home
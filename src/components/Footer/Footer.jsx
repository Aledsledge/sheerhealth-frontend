import React from 'react' // eslint-disable-line no-unused-vars

import { Link } from 'react-router-dom';
import { AiFillYoutube, AiOutlineWhatsApp, AiOutlineInstagram, AiFillFacebook, AiFillTwitterCircle } from 'react-icons/ai';
import { RiLinkedinFill } from 'react-icons/ri';
import logo from '../../assets/images/logo1.png';
import AnimatedLogo from '../AnimatedLogo';



const socialLinks = [
  {
    path: 'https://twitter.com/Sheerhealthh?s=09',
    icon: <AiFillTwitterCircle className=" group-hover:text-white w-4 h-5" />,
  },
  {
    path: 'https://www.facebook.com/profile.php?id=100094686142075&is_tour_completed=true',
    icon: <AiFillFacebook className=" group-hover:text-white w-4 h-5" />,
  },
  {
    path: 'https://www.instagram.com/sheerhealthh/',
    icon: <AiOutlineInstagram className=" group-hover:text-white w-4 h-5" />,
  },
  {
    path: 'https://wa.me/message/LKBLXOCZLLH2F1',
    icon: <AiOutlineWhatsApp className=" group-hover:text-white w-4 h-5" />,
  },

];
const QuickLinks01 = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/Appoinment',
    display: 'Appointment',
  },
  {
    path: '/medicalservices',
    display: 'Services',
  },
  {
    path: '/contact',
    display: 'Contact',
  },
  {
    path: '/CBlog',
    display: 'Blog',
  },
];

const QuickLinks02 = [
  {
    path: 'OurDoctors',
    display: 'Find a Doctor',
  },
  {
    path: '/Appoinment',
    display: ' Request an Appointment',
  },
  {
    path: '/contact',
    display: 'Get an opinion',
  },
 
];

const QuickLinks03 = [
  {
    path: '/Location',
    display: '6-12 1st Cross DV block rt nagar Bengaluru 560032, Karnataka',
  },
  
  {

    display: 'Phone No: +91 8050863265',
  },
  {

    display: 'Email: sheerhealthh@gmail.com',
  },
  {

    display: 'Email: drfurkaan@sheerhealth.in',
  },
  {

    display: 'Email: drshimeiyan@sheerhealth.in',
  },

];

const Footer = () => {
  
  return <footer className='pb-16 pt-20'>
    <div className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_max-content_max-content_1fr] gap-8">
        <div>
          <Link to="/" className="flex items-center">
            <AnimatedLogo src={logo} alt="" heightPx={85} />
          </Link>
          <p className='text-[16px] leading-7 font-[400] text-textColor mt-4'>
             We Help Patients Live a Healthy Quality Life</p>
          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map((link, index) => <Link to={link.path} key={index}
              className='w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none'>{link.icon}</Link>)}
          </div>
        </div>
        <div className="lg:pl-8">
          <h2 className='text-[20px] leading-[30px] font-[700] mb-8 text-headingColor'>Quick Links
          </h2>
          <ul>
            {QuickLinks01.map((item, index) => <li key={index} className='mb-4'><Link to={item.path}
              className='text-[16px] leading-7 font-[400] text-textColor' >{item.display} </Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className='text-[20px] leading-[30px] font-[700] mb-8 text-headingColor'>I want to
          </h2>
          <ul>
            {QuickLinks02.map((item, index) => <li key={index} className='mb-4'><Link to={item.path}
              className='text-[16px] leading-7 font-[400] text-textColor' >{item.display} </Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className='text-[20px] leading-[30px] font-[700] mb-8 text-headingColor'>Address
          </h2>
          <ul>
            {QuickLinks03.map((item, index) => <li key={index} className='mb-4'><Link to={item.path}
              className='text-[16px] leading-7 font-[400] text-textColor' >{item.display} </Link></li>)}
          </ul>
        </div>
      </div>

    </div>
  </footer>
}

export default Footer
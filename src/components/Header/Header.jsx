import { useEffect, useRef, useState } from 'react';
import userImg from '../../assets/images/avatar-icon.png';
import { NavLink, Link } from 'react-router-dom';
import { BiMenu, BiX, BiChevronDown } from 'react-icons/bi';
import logo from '../../assets/images/logo1.png';
import AnimatedLogo from '../AnimatedLogo';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const navLinks = [
  {
    path: '/home',
    display: 'HOME',
  },
  {
    path: '/Appoinment',
    display: ' APPOINTMENT',
  },
  {
    path: '/medicalservices',
    display: 'SERVICES',
  },
  {
    path: '/contact',
    display: 'CONTACT',
  },
  {
    path: '/CBlog',
    display: 'BLOG',
  },
];
const dropdownStyles = {
  control: (provided) => ({
    ...provided,
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    background: '#fff',
    fontSize: '1rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    paddingLeft: '0.75rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    color: state.isSelected ? '#0080FF' : '#333',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.25rem',
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '0.25rem',
    borderRadius: '0.375rem',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  }),
  singleValue: (provided) => ({
    ...provided,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
  }),
};

const Header = ({ isAdmin, user, logout }) => {
  console.log('User prop in Header:', user);
  const [isNavOpen, setNavOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('/admin');

  const toggleMenu = () => {
    setNavOpen((prevState) => !prevState);
    if (!isNavOpen) {
      menuRef.current.style.top = '80px';
    } else {
      menuRef.current.style.top = '-100%';
    }
  };

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const handleStickyHeader = () => {
    const headerElement = headerRef.current;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 80) {
      headerElement.classList.add('sticky_header');
    } else {
      headerElement.classList.remove('sticky_header');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleStickyHeader);
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  // Initialize useNavigate hook
  const navigate = useNavigate();

  const handleOptionChange = (option) => {
    setSelectedOption(option.value);
    // Manually navigate to the selected option's value
    navigate(option.value); // Use useNavigate instead of useHistory

    // Close the sidebar on option change
    setNavOpen(false);
  };

  const handleNavLinkClick = () => {
    // Close the sidebar on navigation link click
    setNavOpen(false);
  };

  const handleLogout = () => {
    // Call the logout function received from props to handle user logout
    if (logout) {
      logout();
    }
  };

  const dropdownOptions = [
    { value: '/create', label: 'Add Blog' },
    { value: '/addfaq', label: 'Add Faq' },
    { value: '/addservice', label: 'Add Service' },
  ];

  return (
    <>
      <header className="header flex items-center bg-white" ref={headerRef}>
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link to="/" className="flex items-center">
                <AnimatedLogo src={logo} alt="" heightPx={85} hoverClassName="logo-hover" />
              </Link>
            </div>
            <div className={`navigation ${isNavOpen ? 'show_menu' : ''}`} ref={menuRef}>
              <span className="md:hidden" onClick={toggleMenu}>
                {isNavOpen ? (
                  <BiX className="w-10 h-10 cursor-pointer" onClick={toggleMenu} />
                ) : (
                  <BiMenu className="w-10 h-10 color-blue cursor-pointer" onClick={toggleMenu} />
                )}
              </span>
              <ul className="menu flex items-center gap-6 lg:gap-[2.7rem]">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? 'text-primaryColor text-[16px] leading-3 font-[600]'
                          : 'text-textColor text-[16px] leading-3 font-[500] hover:text-primaryColor'
                      }
                      onClick={handleNavLinkClick} // Add onClick event handler to close sidebar on navigation link click
                    >
                      {link.display}
                    </NavLink>
                  </li>
                ))}
                {isAdmin && (
                  <li className="NavItem">
                  <Select
                    options={dropdownOptions}
                    value={dropdownOptions.find((option) => option.value === selectedOption)}
                    onChange={handleOptionChange}
                    styles={dropdownStyles} // Apply the custom styles
                    className="text-primaryColor text-[16px] leading-7 font-[600] border-none outline-none cursor-pointer"
                    components={{
                      IndicatorSeparator: () => null, // Hide the indicator separator
                      DropdownIndicator: (props) => ( // Add custom dropdown indicator
                        <div className="flex items-center justify-center w-8 h-8">
                          <BiChevronDown {...props} />
                        </div>
                      ),
                    }}
                  />
                </li>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-4">
            {user ? (
                <>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <div className="hidden">
                    <Link to="/">
                      <figure className="w-[35px] rounded-full">
                        <img src={userImg} className="w-full rounded-full" alt="" />
                      </figure>
                    </Link>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                >
                  <Link to="/login">Login</Link>
                </button>
              )}
              <span className="md:hidden" onClick={toggleMenu}>
                {isNavOpen ? <BiX className="w-8 h-8 cursor-pointer" /> : <BiMenu className="w-8 h-8 cursor-pointer" />}
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* ... (rest of the component) */}
    </>
  );
};

export default Header;

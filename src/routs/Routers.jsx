import {useEffect,useState,lazy,Suspense} from 'react'; // eslint-disable-line no-unused-vars

import Home from "../pages/Home";
import Services from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import DoctorDetails from "../pages/Doctors/DoctorsDetails";
import {AuthProvider} from '../pages/AuthContext'
// Lazy-loaded: this admin-only page pulls in the TipTap rich text editor,
// which should not be part of the bundle every public visitor (e.g. Detail.jsx
// readers) downloads on first load.
const AddEditBlog = lazy(() => import('../pages/AddEditBlog'));
import AddFaq from '../pages/AddFaq';
import Addservices from '../pages/Addservices';
import CBlog from "../pages/CBlog";
import Detail from "../pages/Detail";

import Reset from "../pages/Reset";
import VarifyEmail from "../pages/VerifyEmail";


import {onAuthStateChanged} from 'firebase/auth'
import useAdmin from "../utils/hooks"
import { auth } from "../firebase";
import OurDoctors from "../pages/OurDoctors";
import Location from "../pages/Location";






import {Routes,Route} from 'react-router-dom';


const Routers = () => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)
  useAdmin()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user||{});
      setCurrentUser(user||{})
      console.log("USERRRRRRRRRRRRRRRRRRRRRRRRR",user)
    })
  }, [])
  
  return (
    <AuthProvider  value={{currentUser, timeActive, setTimeActive}}>
   <Suspense fallback={null}>
   <Routes>


    <Route path="/" element={<Home/>} />
    <Route path="/home" element={<Home/>} />
    <Route path="/Appoinment" element={<Doctors/>} />
    <Route path="/medicalservices" element={<DoctorDetails/>} />
    <Route path="login" element={<Login/>} />
    <Route path="register" element={<Signup/>} />
    <Route path="contact" element={<Contact/>} />
    <Route path="OurDoctors" element={<OurDoctors/>} />
    <Route path="Location" element={<Location/>} />
    <Route path="service" element={<Services/>} />
    <Route path="/create"element={ <AddEditBlog user={user}  /> }/>
    <Route path="/update/:id" element={ <AddEditBlog user={user}  /> } />
    <Route path="CBlog"element={ <CBlog   user={user}  />  }/>
    <Route path="/reset" element={<Reset />} />
      <Route path="/verify-email" element={<VarifyEmail />} />
    <Route path="/detail/:id"  element={<Detail user={user} />}/> 

    <Route path="/addfaq"element={ <AddFaq user={user}  /> }/>
    <Route path="/updateFaq/:id" element={ <AddFaq user={user}  /> } />
    <Route path="/addservice"element={ < Addservices user={user}  /> }/>
    <Route path="/updateservice/:id" element={ < Addservices user={user}  /> } />

    {/* SEO-friendly canonical blog URL (e.g. /12-meridians-one-system...).
        A single dynamic segment ranks below every static route above it in
        React Router v6's route-matching, so it can never shadow a real page
        regardless of declaration order - verified with real navigation
        tests to each existing route, not just by relying on that ranking. */}
    <Route path="/:slug" element={<Detail user={user} />} />

    </Routes>
   </Suspense>
   </AuthProvider>
  )
}

export default Routers
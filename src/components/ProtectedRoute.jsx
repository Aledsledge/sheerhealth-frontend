import React from 'react'
import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const userData=localStorage.getItem("USER")
  let currentUser=null
  let isAdmin=false
  if(userData){
      currentUser = JSON.parse(userData);
      isAdmin =currentUser.isAdmin;
  }
  return isAdmin ? children : <Navigate to="/home"/>
}

export default ProtectedRoute
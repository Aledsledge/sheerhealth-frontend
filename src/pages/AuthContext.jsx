import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

export function AuthProvider({ children, value }) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object.isRequired,
};

export function useAuthValue() {
  return useContext(AuthContext);
}
export default AuthProvider
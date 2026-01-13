import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLogin, setUserLogin] = useState('');
    const SERVER = 'http://localhost:3001'
    
    
    
    
    const checkAuthStatus = async () => {
      try{
          const response = await fetch(`${SERVER}/api/auth-status`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          if (data.isAuthenticated){
            setIsAuthenticated(true);
            setUserLogin(data.userLogin);
          }
          else{
            setIsAuthenticated(false);
            setUserLogin('');
          }
          return response;
        } catch (error) {
          console.error('Error of checking status of autheticated', error);
          setIsAuthenticated(false);
          setUserLogin('');
          return response;
        }
    };


  useEffect(() => {
    checkAuthStatus();
  }, []);


  const handleLogOut = async () => {
      try{
        const response = await fetch(`${SERVER}/api/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await response.json();
        if(data.success){
          setIsAuthenticated(false);
          setUserLogin('');
        } else {
          alert(data.message);
        }
      } catch(error){
        console.error('LogOut is failed: ', error);
        alert('Error was happend during LogOut');
      }
    };

  const login = (login) => {
    setIsAuthenticated(true);
    setUserLogin(login);
  };


  return (
    <AuthContext.Provider value={{isAuthenticated, userLogin, handleLogOut, login, checkAuthStatus}}>
        {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;
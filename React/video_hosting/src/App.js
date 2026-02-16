import React from 'react';
import ReactDOMClient from 'react-dom/client';
import Header from './Components/Header';
import Main from './Components/Main';
import Upload from './Components/Upload';
import Sign from './Components/Sign';
import Profile from './Components/Profile';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Video from './Components/Video';
import Admin from 'Components/Admin';


import { AuthProvider, AuthConsumer } from './AuthContext';

const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
// const serverUrl = 'http://192.168.3.3:3001';


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Content: 'main',
            // user: {
            //     login: '',
            //     password: '',
            // }
        };    
    }

    sendAuthData = async (endpoint, data, loginContextFunction) => {
        try{
            const response = await fetch(`${serverUrl}/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result = await response.json();

            if(result.success){
                // this.setState({
                //     user: data.login,
                //     password: '',
                // });
                if(loginContextFunction){
                    loginContextFunction(data.login, data.userName);
                }
                this.mainClick();
            }
            else if(result.error){
                throw new Error(result.error);
            }
            else{
                throw new Error('Autorization Error: ', result.message)
            }


        } catch (error) {
            console.error('Ошибка:', error);
            alert(`Ошибка: ${error.message}`);
        }

    }

    
    renderContent = (login, checkAuthStatus) =>{
        const{Content} = this.state;
        checkAuthStatus();
        switch(Content){
            case 'main':
                return (<Main SERVER={serverUrl}/>)
            case 'sign':
                return (<Sign 
                    onAuthClick={(props) => this.sendAuthData('auth', props, login,)}
                    onRegistrationClick={(props) => this.sendAuthData('register', props, login)}
                    />)
            case 'upload':
                return (<Upload server={serverUrl} />)
        }
    }
    
    singClick = () =>{
        this.setState({Content: 'sign'})
    }
    
    mainClick = () =>{
        this.setState({Content: 'main'})
    }

    uploadClick = () =>{
        this.setState({Content: 'upload'})
    }


    // handleAuth = async(props) =>{
    //     // this.setState({
    //     //     user:{
    //     //         login: props.login,
    //     //         password: props.password
    //     //     }
    //     // })
    //     // alert(props)
    //     console.log(props)
    //     await this.sendAuthData('auth', {
    //         login: props.login,
    //         password: props.password,
    //     });
    // }

    // handleRegistration = async(props) => {
    //     // this.setState({
    //     //     user:{
    //     //         login: props.login,
    //     //         password: props.password
    //     //     }
    //     // })
    //     // alert(props)
    //     console.log(props)
    //     await this.sendAuthData('register', {
    //         login: props.login,
    //         password: props.password,
    //     })
    // }

    // handleLogOut = async(props) =>{

    // }

    render(){
      return(
        <AuthProvider>
            <BrowserRouter>
                <AuthConsumer>
                        {({ login, handleLogOut, checkAuthStatus, userName }) => (
                            <>
                                <Header
                                    onMainClick={this.mainClick}
                                    onSignClick={this.singClick}
                                    onLogoutClick={handleLogOut}
                                    onUploadClick={this.uploadClick}
                                />
                                <Routes>
                                    
                                        <Route path='/' element={
                                            <div>{this.renderContent(login, checkAuthStatus)}</div>
                                        }/>
                                        <Route path='/video/:link' element={
                                            <Video
                                                SERVER={serverUrl}
                                            />
                                        }/>
                                        <Route path='/profile/:userId' element={
                                            <Profile
                                                SERVER={serverUrl}
                                            />
                                        }/>
                                        <Route path='/admin-panel/' element={
                                            <Admin SERVER={serverUrl}/>
                                        }/>
                                </Routes>
                            </>
                    )}
                </AuthConsumer>
            </BrowserRouter>
        </AuthProvider>
      );
    }
  }



export default App
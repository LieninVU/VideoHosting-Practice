import React from 'react';
import ReactDOMClient from 'react-dom/client';
import Header from './Components/Header';
import Main from './Components/Main';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';



class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Content: 'main',
            user: {
                login: '',
                password: '',
            }
        };    
    }

    renderContent = () =>{
        const{Content} = this.state
        switch(Content){
            case 'main':
                return (<Main/>)
            case 'signup':
                return (<SignUp 
                    onAuthClick={this.handleAuth}
                    onRegistrationClick={this.handleRegistration}
                    />)
        }
    }

    singInClick = () =>{
        this.setState({Content: 'signin'})
    }
    
    singUpClick = () =>{
        this.setState({Content: 'signup'})
    }
    
    mainClick = () =>{
        this.setState({Content: 'main'})
    }


    handleAuth = (props) =>{
        this.setState({
            user:{
                login: props.login,
                password: props.password
            }
        })
        alert(props)
        console.log(props)
    }

    handleRegistration = (props) => {
        this.setState({
            user:{
                login: props.login,
                password: props.password
            }
        })
        alert(props)
        console.log(props)
    }

    render(){
      return(<div><Header
        onMainClick={this.mainClick}
        onSignInClick={this.singInClick}
        onSignUpClick={this.singUpClick}
       
      /><div>{this.renderContent()}</div></div>
      )
    }
  }

export default App
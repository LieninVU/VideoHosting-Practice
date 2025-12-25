import React from "react";

class SignUp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            login: '',
            password: '',
        }
    }

    handleRegistration = () =>{
        this.props.onRegistrationClick({
            login: this.state.login,
            password: this.state.password
        })
    }

    handleAuth = () =>{
        this.props.onAuthClick({
            login: this.state.login,
            password: this.state.password
        })
    }



    render(){
        return(
            <form id='signup'>
                <input type='email' placeholder="input login" onChange={(e) =>  this.setState({login: e.target.value})}></input>
                <input type='password' placeholder="input password" onChange={(e) => this.setState({password: e.target.value})}></input>
                <button type='button' onClick={this.handleRegistration}>signup</button>
                <button type='button' onClick={this.handleAuth}>signin</button>
            </form>
        );
    }
}

export default SignUp
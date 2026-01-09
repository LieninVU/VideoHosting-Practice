import React from "react";

class Sign extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            login: '',
            password: '',
            username: '',
        }
    }

    handleRegistration = () =>{
        if(!this.state.login || !this.state.password || !this.state.username){
            alert('INPUT ALL FORMS');
            return;
        }
        this.props.onRegistrationClick({
            login: this.state.login,
            password: this.state.password,
            username: this.state.username

        })
    }

    handleAuth = () =>{
        if(!this.state.login || !this.state.password){
            alert('INPUT ALL FORMS');
            return;
        }
        this.props.onAuthClick({
            login: this.state.login,
            password: this.state.password,
            username: this.state.username
        })
    }



    render(){
        return(
            <form id='signup'>
                <input type='email' placeholder="input login" onChange={(e) =>  this.setState({login: e.target.value})}></input>
                <input type='password' placeholder="input password" onChange={(e) => this.setState({password: e.target.value})}></input>
                <input type='text' placeholder="input username" onChange={(e) =>  this.setState({username: e.target.value})}></input>
                <button type='button' onClick={this.handleRegistration}>signup</button>
                <button type='button' onClick={this.handleAuth}>signin</button>
            </form>
        );
    }
}

export default Sign
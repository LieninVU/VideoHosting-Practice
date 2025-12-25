import React from "react";

class SignIn extends React.Component {
    render(){
        return(
            <form id='signin'>
                <input type='email' placeholder="input login"></input>
                <input type='password' placeholder="input password"></input>
                <button onClick={this.props.onAuthClick}>signin</button>
            </form>
        );
    }
}

export default SignIn
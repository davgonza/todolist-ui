import React from "react";
import {Link} from 'react-router-dom';

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.submitHandler(this.state);
  };
  render() {
    const {email} = this.props
    return (
      <div id="right-col" className="uk-tile-muted uk-padding-large uk-height-viewport login-box">
        <form onSubmit={this.submitHandler}>
          <input
            className="uk-input"
            type="text"
            placeholder="Email"
            name="email"
            required
            value={this.state.email}
            onChange={this.changeHandler}
          />
          <input
            className="uk-input"
            type="password"
            placeholder="Password"
            name="password"
            required
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <button
          className="uk-button"
          >
          Login</button>
          <br/>
          {email === "Login"
            ? <span className="uk-link-muted"><Link to={`${process.env.PUBLIC_URL}/signup`}>I Don't Have An Account</Link></span>
            : <span className="uk-link-muted"><Link to={`${process.env.PUBLIC_URL}/login`}>I Have An Account Already</Link></span>
          }
        </form>
      </div>
    );
  }
}

export default Login;

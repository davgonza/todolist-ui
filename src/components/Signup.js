import React from "react";
import {Link} from 'react-router-dom';

class Signup extends React.Component {
  state = {
    name: "",
    password: "",
    password_confirmation: "",
    email: ""
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.submitHandler(this.state);
    this.setState({
      name: "",
      password: "",
      password_confirmation: "",
      email: ""
    });
  };
  render() {
    const {name} = this.props
    return (
      <div id="right-col">
        <form onSubmit={this.submitHandler}>
          <legend className="uk-legend">Please sign up</legend>
          <input
            type="text"
            placeholder="username"
            name="name"
            value={this.state.name}
            onChange={this.changeHandler}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <input
            type="password"
            placeholder="confirm password"
            name="password_confirmation"
            value={this.state.password_confirmation}
            onChange={this.changeHandler}
          />
          <input
            type="text"
            placeholder="email"
            name="email"
            value={this.state.email}
            onChange={this.changeHandler}
          />
          <button>Sign Up</button>
          <br/>
          {name === "Login"
            ? <span className="uk-link-muted"><Link to="/signup">I Don't Have An Account</Link></span>
            : <span className="uk-link-muted"><Link to="/login">I Have An Account Already</Link></span>
          }
        </form>
      </div>
    );
  }
}

export default Signup;

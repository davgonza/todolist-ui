import React from "react";
import {Link} from 'react-router-dom';

class Signup extends React.Component {
  state = {
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
      password: "",
      password_confirmation: "",
      email: ""
    });
  };
  render() {
    const {email} = this.props
    return (
      <div id="right-col">
        <form onSubmit={this.submitHandler}>
          <legend className="uk-legend">Please sign up</legend>
          <input
            type="text"
            placeholder="email"
            required
            name="email"
            value={this.state.email}
            onChange={this.changeHandler}
          />
          <input
            type="password"
            placeholder="password"
            required
            name="password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <input
            type="password"
            placeholder="confirm password"
            required
            name="password_confirmation"
            value={this.state.password_confirmation}
            onChange={this.changeHandler}
          />
          <button>Sign Up</button>
          <br/>
          {email === "Login"
            ? <span className="uk-link-muted"><Link to={process.env.PUBLIC_URL + '/signup'}>I Don't Have An Account</Link></span>
            : <span className="uk-link-muted"><Link to={process.env.PUBLIC_URL + '/'}>I Have An Account Already</Link></span>
          }
        </form>
      </div>
    );
  }
}

export default Signup;

import React from 'react';
import { Link } from "react-router-dom";

const Navbar = ({sectionClickHandler, user}) => {

  return (
    <aside id="left-col" className="uk-light">
      <div className="bar-wrap">
      <a className="uk-navbar-item uk-logo"> <span className="uk-margin-small-right" uk-icon="icon: play-circle"></span>What</a>
        <ul className="uk-nav-default uk-nav-parent-icon" uk-nav="true">
						{user.name && <li><a><span className="uk-margin-small-right" uk-icon="icon: user"></span>Welcome {user.name}</a></li>}
						<li className="uk-nav-divider"></li>

            <li className="uk-active"><Link to="/what">Home</Link></li>
            <li className="uk-parent">
                <a>To-do list</a>
                <ul className="uk-nav-sub">
                    <li><Link to="/todo">Most Popular</Link></li>
                </ul>
            </li>


        </ul>
      </div>
    </aside>
  )
}

export default Navbar;

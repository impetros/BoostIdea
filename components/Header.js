import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <div>
      <div className="header-dark">
        <nav className="navbar navbar-dark navbar-expand-md navigation-clean-search">
          <div className="container">
            <a className="navbar-brand" href="/">
              BoostIdea
            </a>
            <button
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navcol-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navcol-1">
              <form className="form-inline mr-auto" target="_self">
                <div className="form-group">
                  <label htmlFor="search-field">
                    <i className="fa fa-search"></i>
                  </label>
                  <input
                    className="form-control search-field"
                    type="search"
                    name="search"
                    id="search-field"
                  />
                </div>
              </form>
              <span className="navbar-text" style={{marginRight: '30px'}}>
                <a href="/" className="login" style={{color: 'gray'}}>
                  Explore
                </a>
              </span>
              <a
                className="btn btn-light action-button"
                role="button"
                href="/ideas/new"
              >
                Create
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

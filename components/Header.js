import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <div>
      <div class="header-dark">
        <nav class="navbar navbar-dark navbar-expand-md navigation-clean-search">
          <div class="container">
            <a class="navbar-brand" href="/">
              BoostIdea
            </a>
            <button
              class="navbar-toggler"
              data-toggle="collapse"
              data-target="#navcol-1"
            >
              <span class="sr-only">Toggle navigation</span>
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navcol-1">
              <form class="form-inline mr-auto" target="_self">
                <div class="form-group">
                  <label for="search-field">
                    <i class="fa fa-search"></i>
                  </label>
                  <input
                    class="form-control search-field"
                    type="search"
                    name="search"
                    id="search-field"
                  />
                </div>
              </form>
              <span class="navbar-text" style={{marginRight: '30px'}}>
                <a href="/" class="login" style={{color: 'gray'}}>
                  Explore
                </a>
              </span>
              <a
                class="btn btn-light action-button"
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

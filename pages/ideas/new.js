import React, { Component } from "react";
import { Form, Button, Input, Message, Container } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const CategoriesEnum = require("../../common/categories.js")[0];

class IdeaNew extends Component {
  state = {
    name: "",
    shortDescription: "",
    description: "",
    imageURL: "",
    reachGoal: "",
    minimumContribution: "",
    category: CategoriesEnum.TECHNOLOGY,
    isDonation: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });
    const minimumContributionInWei = web3.utils.toWei(this.state.minimumContribution, 'ether');
    const reachGoalInWei = web3.utils.toWei(this.state.reachGoal, 'ether');
    try {
      const accounts = await web3.eth.getAccounts();
      console.log("TODO a inceput....");
      await factory.methods
        .createIdea(
          minimumContributionInWei,
          reachGoalInWei,
          this.state.name,
          this.state.shortDescription,
          this.state.description,
          this.state.imageURL,
          parseInt(this.state.category),
          this.state.isDonation
        )
        .send({
          from: accounts[0],
        });

        console.log("TODO a terminat");

      Router.pushRoute("/");
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <div className="contact1">
          <div className="container-contact1">
            <div className="contact1-pic js-tilt" data-tilt>
              <img
                src="https://storage.googleapis.com/petros-projects/698.jpg"
                alt="IMG"
                width="450"
                height="450"
              />
            </div>
            <form onSubmit={this.onSubmit} error={!!this.state.errorMessage} 
              className="contact1-form validate-form">
              <span className="contact1-form-title">Boost Your Idea</span>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="shortDescription"
                  placeholder="Short description"
                  value={this.state.shortDescription}
                  onChange={(event) =>
                    this.setState({ shortDescription: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <textarea
                  className="input1"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                ></textarea>
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="imageURL"
                  placeholder="Image URL"
                  value={this.state.imageURL}
                  onChange={(event) =>
                    this.setState({ imageURL: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="reachGoal"
                  placeholder="Reach Goal (ETH)"
                  value={this.state.reachGoal}
                  onChange={(event) =>
                    this.setState({ reachGoal: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="minimumContribution"
                  placeholder="Minimum contribution (ETH)"
                  value={this.state.minimumContribution}
                  onChange={(event) =>
                    this.setState({ minimumContribution: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <select
                  value={this.state.category}
                  onChange={(event) => {
                    this.setState({ category: event.target.value });
                  }}
                  className="input1 dropdownlist1"
                >
                  {Object.keys(CategoriesEnum).map((key) => (
                    <option key={key} value={CategoriesEnum[key]}>
                      {key}
                    </option>
                  ))}
                </select>
                <span className="shadow-input1"></span>
              </div>

              <div
                className="wrap-input1 validate-input"
                style={{ height: "100px" }}
              >
                <div style={{ float: "left" }}>
                  <input
                    className="input1"
                    type="text"
                    name="isItADonation"
                    placeholder="Is it a donation?"
                    readOnly
                  />
                </div>
                <div style={{ float: "right" }}>
                  <input type="checkbox" id="cbx" style={{ display: "none" }} 
                  value={this.state.isDonation}
                  onChange={(event) =>
                    this.setState({ isDonation: !this.state.isDonation})
                  }/>
                  <label htmlFor="cbx" className="toggle">
                    <span></span>
                  </label>
                </div>
              </div>

              <div className="container-contact1-form-btn">
                <button className="contact1-form-btn">
                  <span>
                    Create
                    <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  }
}

export default IdeaNew;

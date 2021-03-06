import React, { Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Idea from "../../../ethereum/idea";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const idea = Idea(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await idea.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/ideas/${this.props.address}/requests`);
    } catch (err) {
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
              <Link route={`/ideas/${this.props.address}/requests`}>
                <a>Back</a>
              </Link>
              <img
                src="https://storage.googleapis.com/petros-projects/698.jpg"
                alt="IMG"
                width="450"
                height="450"
              />
            </div>
            <form
              onSubmit={this.onSubmit}
              error={!!this.state.errorMessage}
              className="contact1-form validate-form"
            >
              <span className="contact1-form-title">Create a request</span>

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
                  name="value"
                  placeholder="Value (ETH)"
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="wrap-input1 validate-input">
                <input
                  className="input1"
                  type="text"
                  name="recipient"
                  placeholder="Recipient"
                  value={this.state.recipient}
                  onChange={(event) =>
                    this.setState({ recipient: event.target.value })
                  }
                />
                <span className="shadow-input1"></span>
              </div>

              <div className="container-contact1-form-btn">
                <button className="contact1-form-btn">
                  <span>
                    Create
                    <i
                      className="fa fa-long-arrow-right"
                      aria-hidden="true"
                    ></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form> */}
      </Layout>
    );
  }
}

export default RequestNew;

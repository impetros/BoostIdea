import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class IdeaNew extends Component {
  state = {
    name: '',
    shortDescription: '',
    description: '',
    imageURL: '',
    reachGoal: '',
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createIdea(this.state.minimumContribution,
            this.state.reachGoal,
            this.state.name,
            this.state.shortDescription,
            this.state.description,
            this.state.imageURL)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Idea</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Short description</label>
            <Input
              value={this.state.shortDescription}
              onChange={event =>
                this.setState({ shortDescription: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Image url</label>
            <Input
              value={this.state.imageURL}
              onChange={event =>
                this.setState({ imageURL: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Goal</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.reachGoal}
              onChange={event =>
                this.setState({ reachGoal: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default IdeaNew;
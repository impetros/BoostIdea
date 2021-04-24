import React, { Component } from "react";
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class BoostIdeaIndex extends Component {
  static async getInitialProps() {
    const ideas = await factory.methods.getDeployedIdeas().call();
    return { ideas };
  }

  renderIdeas() {
    const items = this.props.ideas.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/ideas/${address}`}>
            <a>View Idea</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Ideas</h3>

          <Link route="/ideas/new">
            <a>
              <Button
                floated="right"
                content="Create Idea"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderIdeas()}
        </div>
      </Layout>
    );
  }
}

export default BoostIdeaIndex;

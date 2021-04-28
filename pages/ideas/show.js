import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Idea from "../../ethereum/idea";
import web3 from "../../ethereum/web3";
import BeAContributorForm from "../../components/BeAContributorForm";
import { Link } from "../../routes";

class IdeaShow extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const idea = Idea(address);

    const summary = await idea.methods.getSummary().call();
    const moreDetails = await idea.methods.getMoreDetails().call();

    return {
      address: address,
      name: summary[0],
      shortDescription: summary[1],
      imageURL: summary[2],
      category: summary[3],
      isDonation: summary[4],
      minimumContribution: summary[5],
      creditsCount: summary[6],
      createdAt: new Date(summary[7] * 1000),
      reachGoal: summary[8],
      description: moreDetails[0],
      requestsCount: moreDetails[1],
      balance: moreDetails[2],
      manager: moreDetails[3]
    };
  }

  renderCards() {
    const {
      address,
      name,
      shortDescription,
      imageURL,
      category,
      isDonation,
      minimumContribution,
      creditsCount,
      createdAt,
      reachGoal,
      description,
      requestsCount,
      balance,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this idea and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: creditsCount,
        meta: "Number of Credits supplied",
        description: "Number of people who have already donated to this idea",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Idea Balance (ether)",
        description:
          "The balance is how much money this idea has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Idea Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <BeAContributorForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/ideas/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default IdeaShow;

import React, { Component } from "react";
import { Card, Grid, Button, Image } from "semantic-ui-react";
import Layout from "../../components/Layout";
import CategorySpan from "../../components/CategorySpan";
import Idea from "../../ethereum/idea";
import web3 from "../../ethereum/web3";
import BeAContributorForm from "../../components/BeAContributorForm";
import { Link } from "../../routes";
import ProgressBar from "../../components/ProgressBar";

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
      manager: moreDetails[3],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      creditsCount,
      requestsCount,
      balance,
      manager,
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
        header: web3.utils.fromWei(minimumContribution, "ether"),
        meta: "Minimum Contribution (ETH)",
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
        meta: "Idea Balance (ETH)",
        description:
          "The balance is how much money this idea has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    const percent =
      ((this.props.minimumContribution * this.props.creditsCount) /
        this.props.reachGoal) *
      100;
    return (
      <Layout>
        <section style={{ margin: "0 20% 0 20%" }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <Image src={this.props.imageURL} width="500" height="500" 
                style={{marginTop: '15px'}}/>
                {this.props.isDonation && (
                  <div>
                    <div
                      style={{
                        float: "left",
                        fontWeight: "bold",
                        fontSize: "2em",
                        color: "lightpink",
                      }}
                    >
                      - Charitable Purpose
                    </div>
                    <img
                      src="https://img.favpng.com/17/7/7/heart-icon-love-icon-png-favpng-fdEYx0u0j6vLbKTw6ptuPxCD2.jpg"
                      width="50"
                      height="50"
                      style={{ float: "left" }}
                    ></img>
                  </div>
                )}
              </Grid.Column>

              <Grid.Column width={6}>
                <h2 style={{ fontSize: "2.5em", fontWeight: "bold" }}>
                  {this.props.name}
                </h2>
                <div style={{ width: "30%", float: "right" }}>
                  <CategorySpan categoryName={this.props.category} />
                </div>
                <h4 style={{ fontStyle: "italic" }}>
                  {this.props.shortDescription}
                </h4>
                <p>{this.props.description}</p>
                <div>
                  <ProgressBar
                    percent={percent}
                    goal={web3.utils.fromWei(this.props.reachGoal, "ether")}
                  ></ProgressBar>
                </div>
                <BeAContributorForm address={this.props.address} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>{this.renderCards()}</Grid.Column>
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
        </section>
      </Layout>
    );
  }
}

export default IdeaShow;

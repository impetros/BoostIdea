import React, { Component } from "react";
import { Container } from 'semantic-ui-react';
import factory from "../../ethereum/factory";
import Idea from "../../ethereum/idea";
import Layout from '../../components/Layout';
import IdeasCards from '../../components/IdeasCards';

class AllIdeas extends Component {
  static async getInitialProps() {
    const deployedIdeas = await factory.methods.getDeployedIdeas().call();
    let ideas = [];
    await Promise.all(
      deployedIdeas.map(async (deployedIdea) => {
        const idea = Idea(deployedIdea);
        const summary = await idea.methods.getSummary().call();
        if(summary[0] == "nume"){
          return;
        }
        ideas.push({
          address: deployedIdea,
          name: summary[0],
          shortDescription: summary[1],
          imageURL: summary[2],
          category: summary[3],
          isDonation: summary[4],
          minimumContribution: summary[5],
          credits: summary[6],
          createdAt: new Date(summary[7] * 1000),
          reachGoal: summary[8],
        });
      })
    );
    return { ideas };
  }

  renderIdeas() {
    return <IdeasCards ideas={this.props.ideas}/>;
  }

  render() {
    return (
      <Layout>
        <div style={{margin: '20px 10px 0 80px'}}>
          <h3 style={{ fontSize: '2.5rem',fontWeight: 'bold', marginBottom: 'bold', marginBottom: '20px' }}>All Ideas</h3>
          {this.renderIdeas()}
        </div>
      </Layout>
    );
  }
}

export default AllIdeas;

import React, { Component } from "react";
import { Card, Image, Progress, Container } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Idea from '../ethereum/idea';
import Layout from '../components/Layout';


class BoostIdeaIndex extends Component {
  static async getInitialProps() {
    const deployedIdeas = await factory.methods.getDeployedIdeas().call();
    let ideas = [];
    await Promise.all(deployedIdeas.map(async (deployedIdea) => {
      const idea = Idea(deployedIdea);
      const summary = await idea.methods.getSummary().call();
      console.log(summary);
      ideas.push({
        name: summary[0],
        shortDescription: summary[1],
        description: summary[2],
        imageURL: summary[3],
        minimumContribution: summary[4],
        balance: summary[5],
        requestsCount: summary[6],
        creditsCount: summary[7],
        address: summary[8],
        manager: summary[9],
        createdAt: new Date(summary[10] * 1000),
        reachGoal: summary[11]});
    }));
    return { ideas };
  }

  renderIdeas() {
    const items = this.props.ideas.map(idea => {
      const percent = (idea.minimumContribution * idea.creditsCount) / idea.reachGoal;
      return {
        header: idea.name,
        image: <Image src={idea.imageURL} size='medium' wrapped />,
        meta: "Created at " + idea.createdAt.toString().substring(0, idea.createdAt.toString().indexOf("T")),
        description: idea.shortDescription,
        extra:<Progress percent={percent} progress='percent' indicating></Progress>,
        href: `/ideas/${idea.address}`
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div class="myContainer">
           <Image src='https://storage.googleapis.com/petros-projects/2822.jpg' className="banner1"/>
           <div class="centered bannerTitle">Crowfunding Platform</div>
        </div>
        
        <Container>
          <h3>Open Ideas</h3>
          {this.renderIdeas()}
        </Container>
      </Layout>
    );
  }
}

export default BoostIdeaIndex;

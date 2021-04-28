import React, { Component } from "react";
import { Card, Image, Progress, Container } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Idea from '../ethereum/idea';
import Layout from '../components/Layout';


class BoostIdeaIndex extends Component {
  static async getInitialProps() {
    const deployedIdeas = await factory.methods.getDeployedIdeas().call();
    let ideas = [];
    await Promise.all(deployedIdeas.slice(Math.max(deployedIdeas.length - 5, 0)).map(async (deployedIdea) => {
      const idea = Idea(deployedIdea);
      const summary = await idea.methods.getSummary().call();
      console.log(summary);
      ideas.push({
        name: summary[0],
        shortDescription: summary[1],
        imageURL: summary[2],
        category: summary[3],
        isDonation: summary[4],
        oneCreditValue: summary[5],
        credits: summary[6],
        createdAt: new Date(summary[7] * 1000),
        reachGoal: summary[8]});
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
        <div className="myContainer">
           <Image src='https://storage.googleapis.com/petros-projects/2822.jpg' className="banner1"/>
           <div className="centered">

             <div className="bannerTitle">
                Crowfunding Platform
             </div>
             <div className="bannerDescription">
                Raising Money Has Never Been So Easy
             </div>
             <a className="createBanner" role="button" href="/ideas/new">Boost Your Idea</a>
            </div>
        </div>
        
        <Container>
          <h3>Hot ideas</h3>
          {this.renderIdeas()}
        </Container>
      </Layout>
    );
  }
}

export default BoostIdeaIndex;

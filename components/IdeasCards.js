import React, { Component } from 'react';
import { Image, Progress, Card } from 'semantic-ui-react';

class IdeasCards extends Component {
  render() {
    const items = this.props.ideas.map((idea) => {
      const percent =
        (idea.minimumContribution * idea.creditsCount) / idea.reachGoal;
      return {
        header: idea.name,
        image: <Image src={idea.imageURL} size="medium" wrapped />,
        meta:
          "Created at " +
          idea.createdAt
            .toString()
            .substring(0, idea.createdAt.toString().indexOf("T")),
        description: idea.shortDescription,
        extra: (
          <Progress percent={percent} progress="percent" indicating></Progress>
        ),
        href: `/ideas/${idea.address}`,
      };
    });

    return <Card.Group items={items} />;
  }
}

export default IdeasCards;

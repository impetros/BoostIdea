import React, { Component } from 'react';
import { Image, Progress, Card } from 'semantic-ui-react';
import CategorySpan from './CategorySpan';

class IdeasCards extends Component {
  render() {
    const items = this.props.ideas.map((idea) => {
      const percent =
        (idea.minimumContribution * idea.credits) / idea.reachGoal * 100;
      return {
        header: idea.name,
        image: <Image src={idea.imageURL} size="medium" wrapped />,
        meta:
          "Created at " +
          idea.createdAt
            .toString()
            .substring(0, idea.createdAt.toString().indexOf("T")),
        description: 
            <div>
                <div style={{width: '50%', float: 'right'}}>
                    <CategorySpan categoryName={idea.category} />
                </div>
                <div style={{color: 'black'}}>
                    {idea.shortDescription}
                </div>
            </div>,
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

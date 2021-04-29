import React, { Component } from 'react';
import { Image, Card } from 'semantic-ui-react';
import CategorySpan from './CategorySpan';
import ProgressBar from './ProgressBar';
import web3 from "../ethereum/web3";

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
          <ProgressBar percent={percent} goal={web3.utils.fromWei(idea.reachGoal, 'ether')}></ProgressBar>
        ),
        href: `/ideas/${idea.address}`,
      };
    });

    return <Card.Group items={items} />;
  }
}

export default IdeasCards;

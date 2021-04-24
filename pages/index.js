import React, { Component } from "react";
import factory from '../ethereum/factory';

class BoostIdeaIndex extends Component {
  static async getInitialProps() {
    const ideas = await factory.methods.getDeployedIdeas().call();
    console.log(ideas);
    return { ideas };
  }

  render() {
    return (
      <div>
        <h3>Ideas</h3>
      </div>
    );
  }
}

export default BoostIdeaIndex;

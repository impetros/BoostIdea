import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Idea from '../ethereum/idea';

class RequestRow extends Component {
  onApprove = async () => {
    const idea = Idea(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await idea.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  onFinalize = async () => {
    const idea = Idea(this.props.address);

    const accounts = await web3.eth.getAccounts();
    try {
      await idea.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      });
    } catch(ex) {
      console.log(ex);
    }
    
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, creditsCount } = this.props;
    const readyToFinalize = request.credits > creditsCount / 2;
    console.log(request);
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.credits}/{creditsCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
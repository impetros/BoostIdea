import React, { Component } from "react";
import { Button, Card, Progress } from "semantic-ui-react";
import Idea from "../ethereum/idea";
import web3 from "../ethereum/web3";

class RequestsCards extends Component {
  onApprove = async (address, id) => {
    console.log(address);
    console.log(id);
    const idea = Idea(address);

    const accounts = await web3.eth.getAccounts();
    await idea.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  onFinalize = async (address, id) => {
    const idea = Idea(address);

    const accounts = await web3.eth.getAccounts();
    try {
      await idea.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const requests = this.props.requests.map((request) => {
      const initialPercent = (request.credits / this.props.creditsCount) * 100;
      const percentString = initialPercent.toString();
      const percent = percentString.substring(0, (percentString.indexOf('.') > -1 && percentString.indexOf('.') + 3 < percentString.length) ? 
                                                    percentString.indexOf('.') + 3 : percentString.length);
      const createdAtDate = new Date(request.createdAt * 1000);
      const createdAt = createdAtDate.toLocaleString();
      console.log("vefore: " + initialPercent + " | after: " + percent);
      return {
        header: request.description,
        meta: "Created at " + createdAt,
        description: (
          <div>
            Amount:{" "}
            <span className="requestCardDescription">
              {web3.utils.fromWei(request.value, "ether")} ETH
            </span>{" "}
            <br />
            Recipient:{" "}
            <span className="requestCardDescription">
              {request.recipient}
            </span>{" "}
            <br />
          </div>
        ),
        extra: (
          <div>
            { this.props.finished != true && 
            <div className="ui two buttons">
              <Button
                basic
                color="green"
                onClick={(e) => {
                  this.onApprove(this.props.ideaAddress, request.id);
                }}
              >
                Approve
              </Button>
              <Button
                basic
                color="teal"
                onClick={(e) => {
                  this.onFinalize(this.props.ideaAddress, request.id);
                }}
              >
                Finalize
              </Button>
            </div>
            }
            <br/>
            
              <Progress
              percent={percent}
              progress="percent"
              indicating
              style={{margin: '20px 0'}}
            ></Progress>
            
          </div>
        ),
      };
    });
    return <Card.Group items={requests} />;
  }
}

export default RequestsCards;

import React, { Component } from "react";
import { Button, Table, Container } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Idea from "../../../ethereum/idea";
import RequestsCards from "../../../components/RequestsCards";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const idea = Idea(address);
    const numRequests = await idea.methods.numRequests().call();
    const creditsCount = await idea.methods.credits().call();

    const requests = await Promise.all(
      Array(parseInt(numRequests))
        .fill()
        .map(async (element, index) => {
          let request = await idea.methods.requests(index).call();
          request.id = index;
          return request;
        })
    );

    return { address, requests, requestCount: numRequests, creditsCount };
  }

  render() {
    return (
      <Layout>
        <Container>
          <div style={{marginTop: '20px'}}>
            <Link route={`/ideas/${this.props.address}/requests/new`}>
              <a>
                <Button primary floated="right" style={{ marginBottom: 10 }}>
                  Add Request
                </Button>
              </a>
            </Link>
            {this.props.requests.find((p) => !p.complete) != undefined && (
              <div>
                <h2>Open requests</h2>
                <div style={{ margin: "20px 0" }}>
                  <RequestsCards
                    ideaAddress={this.props.address}
                    requests={this.props.requests.filter((p) => !p.complete)}
                    creditsCount={this.props.creditsCount}
                    finished={false}
                  />
                </div>
              </div>
            )}

            {this.props.requests.find((p) => p.complete) != undefined && (
              <div>
                <h2>Closed requests</h2>
                <div style={{ margin: "20px 0" }}>
                  <RequestsCards
                    ideaAddress={this.props.address}
                    requests={this.props.requests.filter((p) => p.complete)}
                    creditsCount={this.props.creditsCount}
                    finished={true}
                  />
                </div>
              </div>
            )}

            <div>Found {this.props.requestCount} requests.</div>
          </div>
        </Container>
      </Layout>
    );
  }
}

export default RequestIndex;

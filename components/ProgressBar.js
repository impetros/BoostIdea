import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';

class ProgressBar extends Component {
    render() {
        return (
            <div>
                <Progress percent={this.props.percent} progress="percent" indicating></Progress>
                <div style={{fontSize: '1.5em' , fontWeight: 'bold'}}>
                    Goal: <span style={{color: '#674df0'}}>{this.props.goal}.00 ETH</span> 
                    <img src="https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg"
                        width="30"
                        height="30"
                    ></img>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';

class ProgressBar extends Component {
    render() {
        const percentString = this.props.percent.toString();
        const percent = percentString.substring(0, (ercentString.indexOf('.') > -1 && percentString.indexOf('.') + 3 < percentString.length) ? 
                                                    percentString.indexOf('.') + 3 : percentString.length);
        console.log("before: " + this.props.percent + " | after: " + percent);
        return (
            <div>
                <Progress percent={percent} progress="percent" indicating></Progress>
                <div style={{fontSize: '1.5em' , fontWeight: 'bold'}}>
                    Goal: <span style={{color: '#674df0'}}>{this.props.goal} ETH</span> 
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
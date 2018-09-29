import React, { Component } from 'react';
import Comp from "./component";
import ReactDom from "react-dom";
import './index.css';

class App extends Component {
    render() {
        return (
            <div>
                <p>test11</p>
                <p>test22</p>
                <div>123</div>
                <Comp/>
            </div>
        );
    }
}

ReactDom.render(<App />, document.getElementById('root'));
import React, { Component } from 'react';
import ReactDom from "react-dom";
import Comp from "./component";
import A from "./a";
import './index.css';

class App extends Component {
    render() {
        return (
            <div>
                <p>test11</p>
                <p>test22</p>
                <div>123</div>
                <A />
                <Comp/>
            </div>
        );
    }
}

ReactDom.render(<App />, document.getElementById('root'));
import React, { Component } from 'react';
import Comp from "./component";
import ReactDom from "react-dom";
import './index.css';
class App extends Component {
    render() {
        return (
            <div>
                <div>test11</div>
                <div>test22</div>
                <Comp/>
            </div>
        );
    }
}

ReactDom.render(<App />, document.getElementById('root'));
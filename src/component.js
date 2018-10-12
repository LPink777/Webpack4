import React, { Component } from 'react';
import A from "./a";
import './index.css';

class Comp extends Component {
    render() {
        return (
            <div>
                test!
                <A />
            </div>
        );
    }
}

export default Comp;

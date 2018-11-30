import "maycur-antd/lib/button/style/css";
import _Button from "maycur-antd/lib/button";
import "maycur-antd/lib/input/style/css";
import _Input from "maycur-antd/lib/input";
import React, { Component } from 'react';
let prefix = 'mkbs';

class FuzzFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return React.createElement("div", {
      className: `${prefix}-fuzz-filter`
    }, React.createElement(_Input, null), React.createElement(_Button, {
      type: "primary"
    }, "\u786E\u5B9A"));
  }

}

export default FuzzFilter;
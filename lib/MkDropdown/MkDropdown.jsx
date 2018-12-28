import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import ReactDom from 'react-dom'; // import classnames from 'classnames';
// import styles from './MkDropdown.less';

import PropTypes from 'prop-types';
const prefix = 'mkbs'; // const className = classnames(styles["mk-dropdown"]);

class MkDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clearAllDom() {
    const dom = document.getElementsByClassName(`${prefix}-dropdown`);

    if (dom.length) {
      for (let d of dom) {
        document.body.removeChild(d);
      }
    }
  }

  appendDom(node) {
    const _this$props = this.props,
          visible = _this$props.visible,
          left = _this$props.left,
          top = _this$props.top;

    if (!visible) {
      this.clearAllDom();
    }

    const _left = node.getBoundingClientRect().left - 12 + left;

    const _top = node.getBoundingClientRect().top + top;

    const cssText = `left:${_left}px;top:${_top}px;`;
    this.popup = document.createElement("div");
    this.popup.className = `${prefix}-dropdown`;
    this.popup.style.cssText = cssText;

    this.popup.onmouseleave = () => {
      //uninstall dom
      if (!visible) {
        ReactDom.unmountComponentAtNode(this.popup);
        document.body.removeChild(this.popup);
        this.clearAllDom();
      }
    };

    document.body.appendChild(this.popup);
    ReactDom.render(this.props.overlay, this.popup);
  }

  componentDidMount() {
    const node = findDOMNode(this);
    const _this$props2 = this.props,
          trigger = _this$props2.trigger,
          visible = _this$props2.visible,
          disabled = _this$props2.disabled;

    if (disabled) {
      return;
    }

    if (visible) {
      this.appendDom(node);
      return;
    }

    if (trigger.includes('hover')) {
      node.onmouseenter = () => {
        this.appendDom(node);
      };
    }

    if (trigger.includes('click')) {
      node.onclick = e => {
        e.stopPropagation();
        this.appendDom(node);
      };
    }
  }

  render() {
    let _this$props3 = this.props,
        children = _this$props3.children,
        disabled = _this$props3.disabled;
    children = React.Children.map(children, (o, i) => {
      const className = o.props.className;
      return React.cloneElement(o, {
        key: i,
        className: `${className} ${disabled ? `${prefix}-disabled` : null}`
      });
    });
    return React.createElement(React.Fragment, null, children);
  }

}

MkDropdown.defaultProps = {
  trigger: ['hover'],
  top: 0,
  left: 0
};
MkDropdown.propTypes = {
  trigger: PropTypes.array,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number
};
export default MkDropdown;
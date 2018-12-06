import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";
import React, { Component } from 'react';
import MkHeader from './MkHeader';
import MkSider from './MkSider';
import PropTypes from 'prop-types';
const prefix = 'mkbs';

class MkLayout extends Component {
  constructor(props) {
    super(props);

    this.onToggleCollapsed = (collapsed, type) => {
      this.setState({
        collapsed: collapsed === undefined ? !this.state.collapsed : collapsed
      });
    };

    this.componentDidMount = () => {
      this.setState({
        collapsed: !(document.body.clientWidth > 1200)
      });
    };

    this.state = {
      collapsed: false
    };
  }

  render() {
    const collapsed = this.state.collapsed;
    const _this$props = this.props,
          pathname = _this$props.location.pathname,
          setMenus = _this$props.setMenus,
          setSiderMenus = _this$props.setSiderMenus,
          renderMenu = _this$props.renderMenu,
          renderSiderMenu = _this$props.renderSiderMenu,
          renderContent = _this$props.renderContent,
          logoUrl = _this$props.logoUrl,
          noSider = _this$props.noSider;
    const menus = setMenus();
    const siderMenus = setSiderMenus();
    return React.createElement(_Layout, {
      className: `${prefix}-page-container`
    }, React.createElement(MkHeader, {
      collapsed: collapsed,
      onToggleCollapsed: this.onToggleCollapsed,
      pathname: pathname,
      leftMenus: menus.leftMenus,
      rightMenus: menus.rightMenus,
      renderMenu: renderMenu,
      logoUrl: logoUrl
    }), React.createElement(_Layout, {
      className: "section"
    }, noSider ? null : React.createElement(MkSider, {
      collapsed: collapsed,
      onToggleCollapsed: this.onToggleCollapsed,
      pathname: pathname,
      menus: siderMenus,
      renderMenu: renderSiderMenu
    }), React.createElement(_Layout, {
      className: "content"
    }, renderContent())));
  }

}

MkLayout.propTypes = {
  setMenus: PropTypes.func,
  renderMenu: PropTypes.func,
  setSiderMenus: PropTypes.func,
  renderSiderMenu: PropTypes.func,
  renderContent: PropTypes.func
};
export default MkLayout;
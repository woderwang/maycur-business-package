import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";
import React, { Component } from 'react';
import _ from 'lodash'; // import Debounce from 'lodash-decorators/debounce';

import MkHeader from './MkHeader';
import MkSider from './MkSider'; // import { Link } from 'dva/router';
// import NormalRouter from 'router/NormalRouter';

import PropTypes from 'prop-types'; // import routerList from 'router/routerList';
// import './Layout.less';

class MkLayout extends Component {
  constructor(props) {
    super(props);

    this.onToggleCollapsed = (collapsed, type) => {
      this.setState({
        collapsed: collapsed === undefined ? !this.state.collapsed : collapsed
      });
    };

    this.componentDidMount = () => {
      // this.resize();
      // window.addEventListener('resize', () => this.resize());
      this.setState({
        collapsed: !(document.body.clientWidth > 1200)
      });
    };

    this.componentWillUnmount = () => {// window.removeEventListener('resize', this.resize);
    };

    this.state = {
      collapsed: false
    };
  } // renderContent = () => {
  //   const { location } = this.props;
  //   return (
  //     <div className={styles.content}>
  //       <NormalRouter location={location} />
  //     </div>
  //   );
  // };
  // renderMenu = (menu) => {
  //   return (
  //     menu.skip ?
  //       <a href={`/admin/${window.location.search}#${menu.path}`}>{menu.menuName}</a> :
  //       <Link replace to={menu.path}>
  //         {menu.name === 'profile' ? <Avatar /> : menu.menuName}
  //       </Link>
  //   )
  // };
  // renderSiderMenu = (menu) => {
  //   return (
  //     <Link replace to={menu.path}>
  //       <span className={`fm ${menu.icon}`}></span>
  //       <span>{menu.menuName}</span>
  //     </Link>
  //   );
  // };
  // getMenus = () => {
  //   const leftMenus = [];
  //   const rightMenus = [];
  //   const rightMenuId = ['/profile'];
  //   _.each(routerList, (route) => {
  //     if (rightMenuId.includes(route.path)) {
  //       rightMenus.push(route);
  //     } else {
  //       leftMenus.push(route);
  //     }
  //   });
  //   return {
  //     leftMenus,
  //     rightMenus
  //   };
  // };
  // getSiderMenus = () => {
  //   const { location: { pathname } } = this.props;
  //   const pathArr = pathname.split('/');
  //   const menuName = pathArr[1] || 'home';
  //   const currentMenu = _.filter(routerList, { name: menuName })[0] || {};
  //   const siderMenus = currentMenu.routes || [];
  //   return siderMenus;
  // };


  render() {
    const collapsed = this.state.collapsed;
    const _this$props = this.props,
          pathname = _this$props.location.pathname,
          setMenus = _this$props.setMenus,
          setSiderMenus = _this$props.setSiderMenus,
          renderMenu = _this$props.renderMenu,
          renderSiderMenu = _this$props.renderSiderMenu,
          renderContent = _this$props.renderContent,
          logoUrl = _this$props.logoUrl;
    const menus = setMenus();
    const siderMenus = setSiderMenus();
    return React.createElement(_Layout, {
      className: "page-container"
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
    }, React.createElement(MkSider, {
      collapsed: collapsed,
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
import "maycur-antd/lib/menu/style/css";
import _Menu from "maycur-antd/lib/menu";
import "maycur-antd/lib/icon/style/css";
import _Icon from "maycur-antd/lib/icon";
import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/web.dom.iterable";
import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
const prefix = 'mkbs';
const Header = _Layout.Header;

const MkHeader = props => {
  const collapsed = props.collapsed,
        pathname = props.pathname,
        onToggleCollapsed = props.onToggleCollapsed,
        leftMenus = props.leftMenus,
        rightMenus = props.rightMenus,
        logoUrl = props.logoUrl;
  let selectedKeys = [];
  const menus = leftMenus.concat(rightMenus);

  _.forEach(menus, item => {
    let routeReg = new RegExp(`^${item.path}`);

    if (routeReg.test(pathname)) {
      selectedKeys.push(item.path);
    }
  });

  const formatMenus = menu => {
    const menuName = menu.meta && menu.meta.name || '';
    return _objectSpread({}, menu, {
      menuName
    });
  };

  const toggleCollapsed = () => {
    if (onToggleCollapsed && typeof onToggleCollapsed === 'function') {
      onToggleCollapsed(!collapsed);
    }
  };

  const logoAreaClassName = classNames(`${prefix}-header-logo`, {
    [`${prefix}-header-logo-collapsed`]: collapsed
  });
  return React.createElement(Header, {
    className: `${prefix}-header`
  }, React.createElement("div", {
    className: logoAreaClassName
  }, React.createElement("div", {
    className: "logo-content"
  }, React.createElement("span", null, React.createElement("img", {
    src: logoUrl,
    alt: "\u6BCF\u523B\u62A5"
  }))), React.createElement(_Icon, {
    onClick: toggleCollapsed,
    className: "trigger",
    type: collapsed ? 'menu-unfold' : 'menu-fold'
  })), React.createElement("div", {
    className: `${prefix}-header-menus`
  }, React.createElement("div", {
    className: "left-menu"
  }, React.createElement(_Menu, {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: [menus[0].path],
    selectedKeys: selectedKeys
  }, leftMenus.map(menu => {
    const formattedMenus = formatMenus(menu);
    return React.createElement(_Menu.Item, {
      key: menu.path
    }, props.renderMenu(formattedMenus));
  }))), rightMenus && rightMenus.length ? React.createElement("div", {
    className: "right-menu"
  }, React.createElement(_Menu, {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: [menus[0].path],
    selectedKeys: selectedKeys
  }, rightMenus.map(menu => {
    const formattedMenus = formatMenus(menu);
    return React.createElement(_Menu.Item, {
      key: menu.path
    }, props.renderMenu(formattedMenus));
  }))) : null));
};

export default MkHeader;
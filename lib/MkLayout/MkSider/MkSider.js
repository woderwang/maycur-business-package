import "maycur-antd/lib/menu/style/css";
import _Menu from "maycur-antd/lib/menu";
import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";
import React from 'react';
import _ from 'lodash';
const Sider = _Layout.Sider;

const MkSider = props => {
  const menus = props.menus,
        pathname = props.pathname,
        collapsed = props.collapsed,
        onToggleCollapsed = props.onToggleCollapsed;
  let selectedKeys;

  if (menus && menus.length) {
    selectedKeys = _.find(menus, {
      path: pathname
    }) ? [pathname] : [menus[0].path];
  }

  return React.createElement(Sider, {
    breakpoint: "xl",
    className: "mk-sider",
    width: 240,
    trigger: null,
    collapsible: true,
    collapsed: collapsed,
    collapsedWidth: 56,
    onCollapse: onToggleCollapsed
  }, React.createElement(_Menu, {
    theme: "light",
    mode: "inline",
    inlineIndent: "40",
    selectedKeys: selectedKeys,
    style: {
      height: '100%',
      borderRight: 0
    }
  }, menus.map(menu => {
    menu.menuName = menu.meta.name;

    if (menu.routes) {
      return React.createElement(SubMenu, {
        key: menu.path,
        title: props.renderMenu(menu)
      }, menu.routes.map(route => {
        route.menuName = route.meta.name;
        return React.createElement(_Menu.Item, {
          key: route.path
        }, props.renderMenu(route));
      }));
    } else {
      return React.createElement(_Menu.Item, {
        key: menu.path
      }, props.renderMenu(menu));
    }
  })));
};

export default MkSider;
import "core-js/modules/es6.regexp.split";
import "maycur-antd/lib/menu/style/css";
import _Menu from "maycur-antd/lib/menu";
import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";
import React from 'react';
import _ from 'lodash';
const prefix = 'mkbs';
const Sider = _Layout.Sider;
const SubMenu = _Menu.SubMenu;

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
    theme: "light",
    className: `${prefix}-sider`,
    width: 240,
    trigger: null,
    collapsible: true,
    collapsed: collapsed,
    collapsedWidth: 56,
    onCollapse: onToggleCollapsed
  }, React.createElement(_Menu, {
    theme: "light",
    mode: "inline",
    inlineIndent: "44",
    selectedKeys: selectedKeys,
    style: {
      height: '100%',
      borderRight: 0
    }
  }, menus.map((menu, index) => {
    if (menu.split) {
      // return <Divider key={index} />
      return null;
    }

    menu.menuName = menu.meta.name;
    const content = props.renderMenu(menu);

    if (!content) {
      return null;
    }

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
      }, content);
    }
  })));
};

export default MkSider;
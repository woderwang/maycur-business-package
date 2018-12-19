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
        pathArr = props.pathArr,
        collapsed = props.collapsed,
        onToggleCollapsed = props.onToggleCollapsed;
  const selectedKeys = pathArr.length > 1 ? [`${pathArr.join('/')}`] : [menus[0].path];
  const defaultOpenKeys = pathArr.length > 2 ? [pathArr.slice(0, pathArr.length - 1).join('/')] : [];
  return React.createElement(Sider, {
    breakpoint: "xl",
    theme: "light",
    className: `${prefix}-sider`,
    width: 220,
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
    defaultOpenKeys: defaultOpenKeys,
    style: {
      height: '100%',
      borderRight: 0
    }
  }, menus.map((menu, index) => {
    /*TODO: 设置菜单根据功能块划分*/
    if (menu.split) {
      return React.createElement(_Menu.Divider, {
        key: index
      });
    }

    let MenuContent;
    menu.menuName = menu.meta.name;
    const content = props.renderMenu(menu);

    if (!content) {
      return null;
    }

    MenuContent = menu.hasSub ? React.createElement(SubMenu, {
      key: menu.path,
      title: props.renderMenu(menu)
    }, menu.routes.map((route, index) => {
      route.menuName = route.meta.name;
      return React.createElement(_Menu.Item, {
        key: route.path
      }, props.renderMenu(route));
    })) : React.createElement(_Menu.Item, {
      key: menu.path
    }, content);
    return MenuContent;
  })));
};

export default MkSider;
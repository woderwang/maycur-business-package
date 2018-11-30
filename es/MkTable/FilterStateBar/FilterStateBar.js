import "core-js/modules/web.dom.iterable";
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
let prefix = 'mkbs';

class FilterStateBar extends Component {
  constructor(props) {
    super(props);

    this.limitLen = function (str) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
      let result = '';

      if (_.isString(str)) {
        if (str.length > len) {
          result = str.substr(0, len) + '...';
        } else {
          result = str;
        }
      } else {
        result = str;
      }

      return result;
    };

    this.state = {};
    this.remove = this.remove.bind(this);
    this.convertFilter = this.convertFilter.bind(this);
  }

  remove(filter) {
    const removeFilter = this.props.removeFilter;
    if (typeof removeFilter === 'function') removeFilter(filter.key);
  }

  convertFilter(filters) {
    const columns = this.props.columns;
    let newFilters = [];

    _.forEach(filters, (filterValue, key) => {
      let filterColumn = _.find(columns, {
        dataIndex: key
      });

      let filterLabel = filterColumn ? filterColumn.title : '无标题';
      let filterName = '';

      if (filterColumn && filterValue && !_.isEmpty(filterValue)) {
        let filterOption = filterColumn.filterOption;
        let filterPlainText = [];

        if (filterColumn.filters) {
          _.forEach(filterColumn.filters, item => {
            if (filterValue.includes(item.value)) {
              filterPlainText.push(item.text);
            }
          });
        }

        if (filterOption) {
          switch (filterOption.type) {
            case 'dateRange':
              filterName = moment(filterValue[0]).format('YYYY/MM/DD') + ' ~ ' + moment(filterValue[1]).format('YYYY/MM/DD');
              break;

            case 'checkbox':
              filterName = this.limitLen(filterPlainText.join(','));
              break;

            default:
              filterName = filterValue;
              break;
          }
        } else if (filterColumn.filters && !filterColumn.filterMultiple) {
          let filterData = _.find(filterColumn.filters, {
            value: filterValue[0]
          });

          filterName = filterData ? filterData.text : filterName;
        }
      }

      if (filterName) newFilters.push({
        key,
        label: filterLabel,
        value: filterValue,
        name: filterName
      });
    });

    return newFilters;
  }

  render() {
    const filters = this.props.filters;
    let theFilters = this.convertFilter(filters);
    let node = null;
    node = React.createElement("div", {
      className: `mkbs-mktable-filterbar`
    }, React.createElement("span", {
      className: 'filter-label'
    }, "\u7B5B\u9009\u6761\u4EF6\uFF1A"), React.createElement("div", {
      className: 'flex-1'
    }, React.createElement("div", {
      className: 'filter-wrapper'
    }, theFilters.map(filter => {
      return React.createElement("div", {
        className: 'filter',
        key: filter.key
      }, React.createElement("span", {
        className: 'filter-label'
      }, filter.label, ":"), React.createElement("span", null, filter.name), React.createElement("span", {
        className: 'filter-close fm fm-cross',
        onClick: e => {
          this.remove(filter);
        }
      }));
    })))); //}

    return node;
  }

}

export default FilterStateBar;
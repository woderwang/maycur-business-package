import "maycur-antd/lib/icon/style/css";
import _Icon from "maycur-antd/lib/icon";
import "maycur-antd/lib/button/style/css";
import _Button from "maycur-antd/lib/button";
import "maycur-antd/lib/table/style/css";
import _Table from "maycur-antd/lib/table";
import "core-js/modules/web.dom.iterable";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*
 * @Author: woder.wang 
 * @desc: maycur-antd 业务包装
 * @Date: 2018-11-27 15:18:53 
 * @Last Modified by: woder.wang
 * @Last Modified time: 2018-12-28 18:08:52
 */

/* resizeable注意事项，在table中，需要至少有一列是非resizeable的，这一列是用来给调整宽度的时候，留给其他列的空间变动的，没有这样的列，交互会异常 */

/* scroll属性指定了fixed header触发的条件 */
import React, { Component } from 'react';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import classnames from 'classnames';
import { DateFilter, FuzzFilter, CheckFilter } from './FilterDropDown';
import FilterStateBar from './FilterStateBar';
import PopSelect from './PopSelect/PopSelect';
import Empty from '../Empty';
import utils from '../utils/utils';
let prefix = utils.prefixCls;
/* title 宽度变动 */

const ResizeableTitle = props => {
  const onResize = props.onResize,
        width = props.width,
        restProps = _objectWithoutProperties(props, ["onResize", "width"]);

  if (!width) {
    return React.createElement("th", restProps);
  }

  return React.createElement(Resizable, {
    width: width,
    height: 0,
    onResize: onResize
  }, React.createElement("th", restProps));
};

let MkTable = option => WrapperComponent => {
  let defaultOption = {
    isFixHeader: false,
    resizeAble: false,
    disableLoad: false,
    hidePagination: false,
    firstDisplayColumns: []
  };
  option = Object.assign(defaultOption, option);
  let defaultPageSizeOptions = [10, 20, 30, 40];

  if (option.pageSize) {
    defaultPageSizeOptions.push(option.pageSize);
    defaultPageSizeOptions.sort((a, b) => {
      return a - b;
    });
  }

  _.forEach(defaultPageSizeOptions, (val, index) => {
    defaultPageSizeOptions[index] = val + '';
  });

  return class extends Component {
    constructor(_props) {
      var _this;

      _this = super(_props);

      this.columnConvert = columns => {
        let cloneColumns = _.cloneDeep(columns);
        /* 设置内置的column属性 */


        _.forEach(cloneColumns, col => {
          if (col.filterOption) {
            if (col.filterOption.type === 'dateRange') {
              col.filterDropdown = (_ref) => {
                let setSelectedKeys = _ref.setSelectedKeys,
                    selectedKeys = _ref.selectedKeys,
                    confirm = _ref.confirm,
                    clearFilters = _ref.clearFilters;
                return React.createElement(DateFilter, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                });
              };
            } else if (col.filterOption.type === 'search') {
              col.filterDropdown = (_ref2) => {
                let setSelectedKeys = _ref2.setSelectedKeys,
                    selectedKeys = _ref2.selectedKeys,
                    confirm = _ref2.confirm,
                    clearFilters = _ref2.clearFilters;
                return React.createElement(FuzzFilter, _extends({}, col, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                }));
              };
            } else if (col.filterOption.type === 'checkbox') {
              col.filterDropdown = (_ref3) => {
                let setSelectedKeys = _ref3.setSelectedKeys,
                    selectedKeys = _ref3.selectedKeys,
                    confirm = _ref3.confirm,
                    clearFilters = _ref3.clearFilters;
                return React.createElement(CheckFilter, _extends({}, col, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                }));
              };
            }
          }
        });

        return cloneColumns || [];
      };

      this.handleResize = index => (e, _ref4) => {
        let size = _ref4.size;
        this.setState((_ref5) => {
          let columns = _ref5.columns;
          const nextColumns = [...columns];
          nextColumns[index] = _objectSpread({}, nextColumns[index], {
            width: size.width
          });
          return {
            columns: nextColumns
          };
        });
      };

      this.onRow = (record, index) => {
        const rowClick = this.props.rowClick;
        return {
          /* 行点击事件 */
          onClick: e => {
            if (typeof rowClick === 'function') {
              rowClick(record);
            }
          }
        };
      };

      this.onChange = (pagination, filters, sorter) => {
        let columns = this.state.columns;
        const currentFilters = this.state.filters;
        let isFilterChange = !_.isEqual(currentFilters, filters);

        _.forEach(filters, (value, key) => {
          if (value) {
            let column = _.find(columns, {
              key
            });

            this.columnModify(column, {
              key: 'filteredValue',
              value
            });
          }
        });

        _.forEach(columns, column => {
          if (sorter && sorter.field && column.key === sorter.field) {
            this.columnModify(column, {
              key: 'sortOrder',
              value: sorter.order
            });
          } else if (column.sortOrder) {
            this.columnModify(column, {
              key: 'sortOrder',
              value: false
            });
          }
        });

        this.setState({
          filters,
          sorter: {
            field: sorter.field,
            order: sorter.order
          },
          pagination
        }, () => {
          this.dataFetch({
            isFilterChange
          });
        });
      };

      this.columnModify = (column, dataPair) => {
        let columns = this.state.columns;

        let idx = _.findIndex(columns, {
          dataIndex: column.dataIndex
        });

        if (dataPair && idx > -1) {
          let key = dataPair.key,
              value = dataPair.value;
          column[key] = value;
          columns[idx] = column;
          this.setState({
            columns
          });
        }
      };

      this.filterChangeNotice = () => {
        const filterChange = this.props.filterChange;
        const filters = this.state.filters;

        if (filterChange && typeof filterChange === 'function') {
          filterChange(filters);
        }
      };

      this.clearAll = () => {
        let columns = this.state.columns;

        _.forEach(columns, col => {
          if (col.filteredValue !== undefined) {
            col.filteredValue = null;
          }
        });

        this.setState({
          columns
        });
      };

      this.removeSingleFilter = filterKey => {
        let _this$state = this.state,
            filters = _this$state.filters,
            pagination = _this$state.pagination,
            sorter = _this$state.sorter;

        let newFilter = _.cloneDeep(filters);
        /* 不要直接对state中的属性做delete操作（会导致无法正常render组件），clone一个来处理*/


        newFilter[filterKey] = [];
        this.onChange(pagination, newFilter, sorter);
      };

      this.generateTable = params => {
        const _this$state2 = this.state,
              columns = _this$state2.columns,
              loading = _this$state2.loading,
              pagination = _this$state2.pagination,
              dataSource = _this$state2.dataSource,
              selectedRowKeys = _this$state2.selectedRowKeys,
              selectAble = _this$state2.selectAble,
              selectAbleLock = _this$state2.selectAbleLock,
              loadProps = _this$state2.loadProps,
              hideColumnCodeList = _this$state2.hideColumnCodeList;
        const rowKey = params.rowKey,
              scroll = params.scroll,
              rowSelectionOption = params.rowSelection;

        const _ref6 = rowSelectionOption || {},
              onSelectionChange = _ref6.onSelectionChange,
              inSelectedRowKeys = _ref6.selectedRowKeys;

        this.rowKey = rowKey;

        let rowSelection = _objectSpread({}, rowSelectionOption, {
          onChange: (selectedRowKeys, selectedRows) => {
            /* 注意：onChange中的selectedRows，因为antd不支持跨页选取，所以selectedRows只包含当前页选中的数据 */
            let unSelectedRows = _.differenceWith(dataSource, selectedRows, _.isEqual);

            let unSelectedRowKeys = _.map(unSelectedRows, row => {
              return row[rowKey];
            });

            if (selectedRows.length > 0) this.modifySelectRows({
              type: 'update',
              rows: selectedRows,
              rowKeys: selectedRowKeys
            });
            if (unSelectedRows.length > 0) this.modifySelectRows({
              type: 'delete',
              rows: unSelectedRows,
              rowKeys: unSelectedRowKeys
            });
          },
          selectedRowKeys: _.union(selectedRowKeys, inSelectedRowKeys)
        });

        let visibleColumns = _.filter(columns, col => {
          return !hideColumnCodeList.includes(col.dataIndex);
        });

        let tableCls = classnames(`${prefix}-mktable-container`, {
          'empty': !dataSource || dataSource && dataSource.length === 0,
          'enable-scroll-x': !(scroll && scroll.x),
          'fix-header': option.isFixHeader
        });
        /* 当前不支持列冻结的功能 */

        let tableScroll = _.assign({}, option.isFixHeader ? {
          y: true
        } : {});

        return React.createElement("div", {
          className: tableCls,
          ref: _ref7 => {
            this.tableRef = _ref7;
          }
        }, React.createElement(_Table, _extends({}, params, {
          rowSelection: selectAble ? rowSelection : selectAbleLock ? {
            selectedRowKeys
          } : null,
          components: this.components,
          columns: visibleColumns,
          scroll: tableScroll,
          pagination: option.hidePagination ? false : pagination,
          dataSource: dataSource,
          onChange: this.onChange,
          loading: _objectSpread({}, loadProps, {
            spinning: loading
          }),
          locale: {
            emptyText: () => React.createElement(Empty, null)
          }
        })));
      };

      this.generateFilter = function () {
        let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const _this$state3 = _this.state,
              filters = _this$state3.filters,
              columns = _this$state3.columns;
        const filterConfig = props.filterConfig;
        return React.createElement(FilterStateBar, {
          filters: filters,
          filterConfig: filterConfig,
          columns: columns,
          removeFilter: _this.removeSingleFilter
        });
      };

      this.setColumns = originColumns => {
        let columns = [],
            hideColumnCodeList = [];

        if (originColumns) {
          let initSorter = {},
              initFilter = {};

          _.forEach(originColumns, column => {
            if (column.sortOrder) {
              initSorter.field = column.dataIndex;
              initSorter.order = column.sortOrder;
            }

            if (column.filteredValue) {
              initFilter[column.dataIndex] = column.filteredValue;
            }

            if (option.firstDisplayColumns.length > 0 && !option.firstDisplayColumns.includes(column.dataIndex)) {
              hideColumnCodeList.push(column.dataIndex);
            }
          });

          columns = this.columnConvert(originColumns);

          if (option.resizeAble) {
            columns = columns.map((col, index) => _objectSpread({}, col, {
              onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index)
              })
            }));
          }

          this.setState({
            columns,
            sorter: initSorter,
            filters: initFilter,
            hideColumnCodeList
          });
        }
      };

      this.setLoadStatus = status => {
        let loading = option.disableLoad ? false : status;
        this.setState({
          loading
        });
      };

      this.showTotal = () => {
        return React.createElement("span", null, "\u603B\u657019\u6761");
      };

      this.dataFetch = function () {
        let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const isFilterChange = params.isFilterChange;
        if (typeof _this.fetchDataSourceFn !== 'function') return;
        let _this$state4 = _this.state,
            filters = _this$state4.filters,
            pagination = _this$state4.pagination,
            sorter = _this$state4.sorter;

        let fnExe = _this.fetchDataSourceFn(filters, {
          pageSize: pagination.pageSize,
          current: pagination.current ? pagination.current : 1
        }, {
          field: sorter.field,
          order: sorter.order === 'descend' ? 'desc' : 'asc'
        });

        let dataSource;

        if (fnExe && fnExe.then) {
          _this.setLoadStatus(true);

          fnExe.then(resp => {
            _this.setLoadStatus(false);

            if (resp.code === 'success') {
              dataSource = resp.data;

              _this.setState((_ref8) => {
                let pagination = _ref8.pagination,
                    selectedRows = _ref8.selectedRows,
                    selectedRowKeys = _ref8.selectedRowKeys;
                return {
                  dataSource,
                  selectedRows: isFilterChange ? [] : selectedRows,
                  selectedRowKeys: isFilterChange ? [] : selectedRowKeys,
                  pagination: _objectSpread({}, pagination, {
                    showQuickJumper: pagination.pageSize < resp.total,
                    total: resp.total
                  })
                };
              });
            }
          }, () => {
            _this.setLoadStatus(false);
          });
        } else {
          dataSource = fnExe;

          if (dataSource && _.isArray(dataSource)) {
            _this.setState({
              dataSource
            });
          }
        }
      };

      this.setDataFetchFn = fn => {
        if (typeof fn === 'function') {
          this.fetchDataSourceFn = fn;
        }
      };

      this.setSelectAble = val => {
        const selectAble = this.state.selectAble;
        this.setState(() => {
          if (selectAble !== val) {
            return {
              selectedRowKeys: [],
              selectAble: val ? true : false,
              selectAbleLock: true
            };
          } else {
            return {};
          }
        });
        /* selectedRowKeys在table组件中需要延后执行,antd的table组件当前在移除checkbox行选择的时候，是无法移除选中状态 */

        setTimeout(() => {
          this.setState({
            selectAbleLock: false
          });
        }, 100);
      };

      this.resetSelectRows = () => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: []
        });
      };

      this.modifySelectRows = operate => {
        let type = operate.type,
            rowKeys = operate.rowKeys,
            rows = operate.rows;

        let _update = () => {
          this.setState((_ref9) => {
            let selectedRows = _ref9.selectedRows,
                selectedRowKeys = _ref9.selectedRowKeys;

            let rebuildSelectedRowKeys = _.union(selectedRowKeys, rowKeys);

            let rebuildSelectRows = _.unionWith(selectedRows, rows, _.isEqual);

            return {
              selectedRows: rebuildSelectRows,
              selectedRowKeys: rebuildSelectedRowKeys
            };
          });
        };

        let _delete = () => {
          this.setState((_ref10) => {
            let selectedRows = _ref10.selectedRows,
                selectedRowKeys = _ref10.selectedRowKeys;

            let rebuildSelectedRowKeys = _.difference(selectedRowKeys, rowKeys);

            let rebuildSelectRows = _.differenceWith(selectedRows, rows, _.isEqual);

            return {
              selectedRows: rebuildSelectRows,
              selectedRowKeys: rebuildSelectedRowKeys
            };
          });
        };

        switch (type) {
          case 'clear':
            this.resetSelectRows();
            break;

          case 'update':
            _update();

            break;

          case 'delete':
            _delete();

            break;

          default:
            break;
        }
      };

      this.customColumns = () => {
        const _this$state5 = this.state,
              columns = _this$state5.columns,
              hideColumnCodeList = _this$state5.hideColumnCodeList;
        let columnsTreeData = [],
            defaultChecked = [];

        _.forEach(columns, col => {
          if (!col.meanLess) {
            columnsTreeData.push({
              code: col.dataIndex,
              name: col.title
            });

            if (!hideColumnCodeList.includes(col.dataIndex)) {
              defaultChecked.push({
                code: col.dataIndex,
                name: col.title
              });
            }
          }
        });

        return React.createElement(PopSelect, {
          options: columnsTreeData,
          defaultValue: defaultChecked,
          close: this.setHideColumnCodeList
        }, React.createElement(_Button, {
          size: "default",
          type: "default"
        }, "\u5B57\u6BB5\u663E\u793A"));
      };

      this.setHideColumnCodeList = data => {
        const columns = this.state.columns;
        let hideColumnCodeList = [];

        _.forEach(columns, col => {
          let findIndex = _.findIndex(data, {
            code: col.dataIndex
          });

          if (findIndex === -1 && !col.meanLess) {
            hideColumnCodeList.push(col.dataIndex);
          }
        });

        this.setState({
          hideColumnCodeList
        });
      };

      this.widthMonitor = () => {
        /* minColumnWidth表格的最小宽度,用于解决长表格被挤压的情况 */
        const columns = this.state.columns;
        let tableMinWidth = 0;
        let minColumnWidth = 100;

        if (columns.length >= 5) {
          _.forEach(columns, col => {
            tableMinWidth += col.width && col.width > 0 ? col.width : minColumnWidth;
          });
        }

        return {
          tableMinWidth
        };
      };

      this.state = {
        columns: [],
        filters: {},
        dataSource: [],
        loading: false,
        loadProps: {
          indicator: React.createElement(_Icon, {
            type: "loading-3-quarters",
            style: {
              fontSize: 24
            },
            spin: true
          })
        },
        pagination: {
          pageSize: option && option.pageSize ? option.pageSize : 10,
          defaultPageSize: option && option.pageSize ? option.pageSize : 10,
          showTotal: total => {
            return React.createElement("span", null, "\u603B\u6570", total, "\u6761");
          },
          pageSizeOptions: defaultPageSizeOptions,
          showSizeChanger: true,
          total: 0
        },
        allSelectedRows: [],
        //所有选中过的data列，支持跨页选取
        selectedRows: [],
        selectedRowKeys: [],
        selectAble: false,
        selectAbleLock: false,
        sorter: {},
        hideColumnCodeList: []
      };
      this.components = {
        header: {
          cell: ResizeableTitle
        }
      };
      this.fetchDataSourceFn = null;
      this.tableRef = null;
    }
    /* column转化，用于自定义的filter dropdown效果 */


    /* 设置table的local state，抛给Wrapper组件使用 */
    setTableState() {}
    /* 设置table可选与否 */


    render() {
      return React.createElement(WrapperComponent, _extends({
        generateTable: this.generateTable,
        generateFilter: this.generateFilter,
        dataFetch: this.dataFetch,
        setColumns: this.setColumns,
        setSelectAble: this.setSelectAble,
        setDataFetchFn: this.setDataFetchFn,
        resetSelectRows: this.resetSelectRows,
        customColumns: this.customColumns
      }, this.state, this.props));
    }

  };
};

export default MkTable;
/* eslint func-names: 0, no-console: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactiveForm from '../src';
//import 'rc-pagination/assets/index.less';

const App = React.createClass({
    getInitialState() {
        return {
        current: 3,
        };
    },
    onChange(page) {
        console.log(page);
        this.setState({
            current: page,
        });
    },
    render() {
        const form = {
            "title": '合同编号',
            "data": [],
            "schema": [
                {
                    name: '_id',
                    type: 'text',
                    formType: 'input',
                    label: '合同编号',
                    placeholder: '首次新增订单，合同号随机生成毋须手工输入',
                    label_col_lg: 'control-label col-lg-2',
                    required: true,
                    disabled: function ( value, data ) {
                        return 'disabled';
                    }
                },{
                    name: '_id',
                    type: 'text',
                    formType: 'input',
                    label: '合同编号',
                    placeholder: '首次新增订单，合同号随机生成毋须手工输入',
                    label_col_lg: 'control-label col-lg-2',
                    required: true
                },{
                    name: '_id',
                    type: 'text',
                    formType: 'input',
                    label: '合同编号',
                    placeholder: '首次新增订单，合同号随机生成毋须手工输入',
                    label_col_lg: 'control-label col-lg-2',
                    required: true
                }
            ]
        }
        return <ReactiveForm form={form} />;
    },
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
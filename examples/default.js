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
                    formType: 'textarea',
                    label: '合同编号',
                    placeholder: '首次新增订单，合同号随机生成毋须手工输入',
                    label_col_lg: 'control-label col-lg-2',
                    required: true
                },{
                    name: 'style',
                    type: 'text',
                    formType: 'array',
                    label: '风格',
                    required: true,
                    model: 'checkbox',
                    //    options: that.optionsItems('style')
                    options: [
                        {label: '潮牌', value: '潮牌'},
                        {label: '甜美', value: '甜美'},
                        {label: '休闲', value: '休闲'},
                        {label: '百搭', value: '百搭'},
                        {label: '中性', value: '中性'},
                        {label: 'OL风', value: 'OL风'},
                        {label: '简约', value: '简约'},
                        {label: '性感', value: '性感'},
                        {label: '文艺', value: '文艺'},
                        {label: '日韩', value: '日韩'},
                        {label: '民族', value: '民族'},
                        {label: '复古', value: '复古'},
                        {label: '欧美', value: '欧美'},
                        {label: '度假', value: '度假'},
                        {label: '原创', value: '原创'},
                        {label: '田园', value: '田园'},
                        {label: '优雅', value: '优雅'},
                        {label: '运动', value: '运动'}
                    ]
                },{
                    name: 'attachAmount',
                    type: 'text',
                    formType: 'array_object',
                    label: '附加费用',
                    options: [
                        {
                            name: 'reason',
                            label: '费用原因',
                            formType: 'input',
                            type: 'text'
                        },
                        {
                            name: 'amount',
                            label: '金额',
                            formType: 'input',
                            type: 'number',
                            placeholder: '费用的金额'
                        }
                    ]
                },{
                    name: 'size_info',
                    formType: 'object',
                    label: '尺寸信息',
                    required: true,
                    object: {
                        options: [
                            {
                                label: '尺码',
                                formType: 'select',
                                //options: that.sizeOptions()
                            }
                        ],
                        objects: [
                            {label: '长度', name: 'length', formType: 'input'},
                            {label: '胸围', name: 'bra', formType: 'input'},
                            {label: '腰围', name: 'waist', formType: 'input'},
                            {label: '臀围', name: 'hip', formType: 'input'},
                            {label: '肩宽', name: 'shoulder', formType: 'input'}
                        ]
                    }
                },{
                    name: '_id',
                    type: 'text',
                    formType: 'date',
                    label: '合同编号',
                    placeholder: '首次新增订单，合同号随机生成毋须手工输入',
                    label_col_lg: 'control-label col-lg-2',
                    required: true,
                    disabled: function ( value, data ) {
                        return 'disabled';
                    }
                }
            ]
        }
        return <ReactiveForm form={form} />;
    },
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
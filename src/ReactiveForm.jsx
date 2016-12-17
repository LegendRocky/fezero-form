let k = 1;
import '../assets/index.less';
import '../assets/ant.css';
import '../assets/iconfont.css';
//import '../bower_components/jquery/dist/jquery.js';

const _ = require('underscore');
const React = require('react');
const $ = require('../bower_components/jquery/dist/jquery.js');

class ReactiveForm extends React.Component {
    constructor(props) {
        super(props);
        [
            'render',
            '_renderFrom',
            '_addChild',
            '_objectChildHandleFunc',
            '_handleFunc'
        ].forEach((method) => this[method] = this[method].bind(this));
    }
    _handleFunc(evt) {
        evt.preventDefault();
        let data = this.props.form && this.props.form.data ? this.props.form.data : {};
        let value = evt.target.type === 'number' ? Number(evt.target.value.trim()) : evt.target.value.trim();
        let keys = evt.target.id.split('.');
        if (keys.length > 1) {
            data[keys[0]] = data[keys[0]] ? data[keys[0]] : {[keys[1]]: ''};
            data[keys[0]][keys[1]] = value;
            if (value == '' || !value) {
                delete data[keys[0]][keys[1]];
            }
        } else {
            data[keys[0]] = value;
        }
        console.log(data);
        this.props.onChange(data);
    }
    _objectChildHandleFunc(evt) {
        evt.preventDefault();
        let form = this.props.form;
        let id = evt.target.id;
        let value = evt.target.type === 'number' ? Number(evt.target.value.trim()) : evt.target.value.trim();
        let keys = _.keys(form.data[id.split('-')[0]]);
        if (id.split('-').length == 3) {
            form.data[id.split('-')[0]][value] = form.data[id.split('-')[0]][keys[id.split('-')[1]]];
            delete  form.data[id.split('-')[0]][keys[id.split('-')[1]]]
        }
        if (id.split('-').length > 3) {
            form.data[id.split('-')[0]][keys[id.split('-')[1]]][id.split('-')[3]] = value;
        }
        this.props.onChange(form.data);
    }
    _addChild(evt){
        evt.preventDefault();
        let props = this.props;
        let form = this.props.form;
        let itemsName = !$(evt.target).parents("div").attr("data-id") ?
                        $(evt.target).attr("data-id") :
                        $(evt.target).parents("div").attr("data-id");

        _.map(form.schema, function (sechma) {
            switch (sechma.formType) {
                case 'array_object':
                    if (sechma.name == itemsName) {
                        let obj = _.object(_.map(sechma.options, function (option) {
                            return option.name;
                        }), _.map(sechma.options, function (option, index) {
                            if (option.name == 'no') {
                                if (!form.data[itemsName]) {
                                    return 1;
                                }

                                let currentNo = _.map(form.data[itemsName], function (item) {
                                    return item.no
                                });

                                return _.max(currentNo) + 1;
                            }

                            if (option.name == "status") {
                                return 'washed'
                            } else {
                                return '';
                            }

                        }));
                        let values = form.data[itemsName] ? form.data[itemsName].concat([obj]) : [obj];
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                    }
                    break;
                case 'array':
                    if (sechma.name == itemsName) {
                        let values = form.data[itemsName] ? form.data[itemsName].concat(['']) : [''];
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                    }
                    break;
                case 'object':
                    if (sechma.name == itemsName) {
                        let obj = _.object(_.map(sechma.object.objects, function (object) {
                            return object.name;
                        }), _.map(sechma.object.objects, function (object) {
                            return '';
                        }));
                        let values = {};
                        if (form.data[itemsName]) {
                            values = _.extend(form.data[itemsName], {['key' + k]: obj});
                        } else {
                            values = {'key': obj}
                        }
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                        k++;
                    }
                    break;
            }
        });

    }
    _renderFrom(schema, index) {
        const that = this;
        let form = this.props.form;
        let value = schema.name.split('.').length >
                    1 &&
                    form.data[schema.name.split('.')[0]] &&
                    form.data[schema.name.split('.')[0]][schema.name.split('.')[1]] ?
                    form.data[schema.name.split('.')[0]][schema.name.split('.')[1]] :
                    form.data[schema.name];
        const required = schema.required && !value ? "ant-form-item-required" : "";
        switch ( schema.formType ) {
            case 'input':
                return (
                    <div className='fezero-form-item ant-form-item ant-row' key={'div_input' + index}>
                        <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                            <label htmlFor={schema.name}
                                className={required}>{schema.label}</label></div>
                        <div className="ant-col-14">
                            <div className="fezero-form-item-control">
                            <input className="ant-input ant-input-lg" id={schema.name} name={schema.name} type={schema.type}
                                readOnly={schema.readonly ? schema.readonly : ''}
                                disabled={ typeof(eval(schema.disabled)) ==
                                           "function" ?
                                           schema.disabled(form.data[schema.name], form.data) :
                                           false}
                                onChange={that._handleFunc}
                                onBlur={that.saveProperty}
                                value={value}
                                defaultValue={schema.defaultValue}
                                placeholder={schema.placeholder} />
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'date':
                //日期按指定格式  手动输入
                var date = new Date(form.data[schema.name]);
                if (!form.data[schema.name]) {
                    date = new Date();
                }
                var year, month, day;
                return (
                    <div className='fezero-form-item ant-form-item ant-row' key={'div_input' + index}>
                        <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                            <label htmlFor={schema.name}
                                className={required}>{schema.label}</label></div>

                        <div className="col-lg-5">
                            <input className="form-control" id={schema.name} name={schema.name} type={schema.type}
                                readOnly={schema.readonly ? schema.readonly : ''}
                                disabled={ typeof(eval(schema.disabled)) ==
                                           "function" ?
                                           schema.disabled(form.data[schema.name], form.data) :
                                           false}
                                onChange={that.handleFunc} onBlur={that.saveProperty}
                                value={value}
                                defaultValue={schema.defaultValue}
                                placeholder={schema.placeholder}/>
                        </div>
                    </div>
                );
                break;

            case 'textarea':
                return (
                    <div className="fezero-form-item ant-form-item ant-row" key={'div_textarea' + index}>
                        <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                            <label htmlFor={schema.name}
                                className={required}>{schema.label}</label></div>
                        <div className="ant-col-14">
                            <textarea className="ant-input" id={schema.name} name={schema.name}
                                readOnly={schema.readonly ? schema.readonly : ''}
                                onChange={that.handleFunc} onBlur={that.saveProperty}
                                disabled={ typeof(eval(schema.disabled)) ==
                                           "function" ?
                                           schema.disabled(form.data[schema.name], form.data) :
                                           false}
                                value={value}
                                rows={schema.rows ? schema.rows : 3}
                                placeholder={schema.placeholder}>
                            </textarea>
                        </div>
                    </div>
                );
                break;

            case 'array':
                if (schema.model && schema.options) {
                    switch (schema.model) {
                        case 'checkbox':
                            //value = form.data[schema.name];
                            //schema.isRequired = schema.required && (!value || !value.length) ? false : true;
                            return (
                                <div className="fezero-form-item ant-form-item ant-row" key={'div_array_checkbox' + index}>
                                    <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                                        <label htmlFor={schema.name}
                                            className={required}>{schema.label}</label></div>
                                    <div className="checkbox">
                                        {
                                            schema.options.map(function (option, radio_index) {
                                                return (
                                                    <label className="radio-inline"
                                                        key={'div_array_checkbox_label' + index + radio_index}>
                                                        <input type="checkbox" name={schema.name} id={schema.name}
                                                            checked={_.contains(form.data[schema.name], option.value)}
                                                            value={option.value}
                                                            disabled={_.isFunction(schema.disabled) ?
                                                                      schema.disabled() :
                                                                      !!schema.disabled}
                                                            onChange={that.handleArrayCheckFun}/>{option.label}
                                                    </label>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            );
                            break;
                    }
                } else {
                    value = form.data[schema.name];
                    schema.isRequired = schema.required && (!value || !value.length) ? false : true;
                    return (
                        <div className="fezero-form-item ant-form-item ant-row" key={'div_array' + index}>
                            <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                                <label htmlFor={schema.name}
                                    className={required}>{schema.label}</label></div>
                            <div className="ant-col-14">
                                <table className="fezero-form-table">
                                    <thead>
                                    <tr>
                                        <th style={{width: 10}}>
                                            <div className="btn-group btn-group-xs" data-id={schema.name}>
                                                <button type="button" className="btn btn-primary btn-lg"
                                                    disabled={_.isFunction(schema.disabled) ?
                                                              schema.disabled() :
                                                              !!schema.disabled}
                                                    data-id={schema.name} id={schema.name} onClick={that.addChild}>
                                                    <span className="glyphicon glyphicon-plus"
                                                        aria-hidden="true"></span>
                                                </button>
                                            </div>
                                        </th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {form.data && form.data[schema.name] ?
                                     form.data[schema.name].map(function (value, child_index) {
                                         return (
                                             <tr key={'div_array_tr' + index + child_index}>
                                                 <td>
                                                     <div className="btn-group btn-group-xs"
                                                         id={schema.name + '-' + child_index + '-array'}>
                                                         <button type="button" className="btn btn-primary btn-lg"
                                                             id={schema.name + '-' + child_index + '-array'}
                                                             disabled={_.isFunction(schema.disabled) ?
                                                                       schema.disabled() :
                                                                       !!schema.disabled}
                                                             onClick={that.removeChild}>
                                                        <span className="glyphicon glyphicon-minus"
                                                            aria-hidden="true"></span>
                                                         </button>
                                                     </div>
                                                 </td>
                                                 <td><input className="form-control input-sm"
                                                     name={schema.name + '-' + child_index}
                                                     id={schema.name + '-' + child_index}
                                                     type={schema.type} value={value}
                                                     disabled={_.isFunction(schema.disabled) ?
                                                               schema.disabled() :
                                                               !!schema.disabled}
                                                     onChange={that.arrayChildHandleFunc}
                                                     onBlur={that.saveArrayProperty}/>
                                                 </td>
                                             </tr>
                                         )
                                     }) : ''
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }
                break;

            case 'object':
                var keys = form.data && form.data[schema.name] ? _.keys(form.data[schema.name]) : [];
                value = form.data[schema.name];
                schema.isRequired = schema.required && (!value || !keys.length) ? false : true;
                return (
                    <div className="fezero-form-item ant-form-item ant-row" key={'div_object' + index}>
                        <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                            <label htmlFor={schema.name}
                                className={required}>{schema.label}</label></div>

                        <div className="ant-col-14">
                            <div className="fezero-table-body">
                            <table className="fezero-form-table" name={schema.name} id={schema.name}>
                                <thead className="fezero-table-thead">
                                <tr>
                                    <th style={{width: 10}}>
                                        <div className="btn-group btn-group-xs" data-id={schema.name}>
                                            <span className="btn" data-id={schema.name} id={schema.name} onClick={that._addChild}>
                                                    <i className="iconfont">&#xe6cf;</i>
                                            </span>
                                        </div>
                                    </th>
                                    { schema.object && schema.object.options ?
                                      schema.object.options.map(function (option, option_index) {
                                          return (
                                              <th key={'div_object_th_options' +
                                                       index +
                                                       option_index}>{option.label}</th>
                                          )
                                      }) : ''
                                    }
                                    {
                                        schema.object && schema.object.objects ?
                                        schema.object.objects.map(function (object, object_index) {
                                            return (
                                                <th key={'div_object_th_object' +
                                                         index +
                                                         object_index}>{object.label}</th>
                                            )
                                        }) : ''
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    form.data && form.data[schema.name] && schema.object ?
                                    keys.map(function (key, child_tr_index) {
                                        return (
                                            <tr key={'div_object_tr' + index + child_tr_index}>
                                                <td>
                                                    <div className="btn-group btn-group-xs"
                                                        id={schema.name + '-' + child_tr_index + '-object-' + key}>
                                                        <span className="btn" data-id={schema.name} id={schema.name} onClick={that._removeChild}>
                                                            <i className="iconfont">&#xe695;</i>
                                                        </span>
                                                    </div>
                                                </td>
                                                {schema.object && schema.object.options ?
                                                 schema.object.options.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_object_tr_td' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <select
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             '-' +
                                                                             opt_index}
                                                                         name={schema.name +
                                                                               '-' +
                                                                               child_tr_index +
                                                                               '-' +
                                                                               opt_index}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={key}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                               opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_object_tr_td_select' +
                                                                                            index +
                                                                                            child_tr_index +
                                                                                            opt_index +
                                                                                            opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_object_tr_td' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <input
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             '-' +
                                                                             opt_index}
                                                                         name={key}
                                                                         onChange={that._objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={key}/>
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                                {schema.object && schema.object.objects ?
                                                 schema.object.objects.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_object_tr_td_o' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <select
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             '-' +
                                                                             opt_index +
                                                                             '-' +
                                                                             opt.name}
                                                                         name={schema.name +
                                                                               '-' +
                                                                               child_tr_index +
                                                                               '-' +
                                                                               opt_index +
                                                                               '-' +
                                                                               opt.name}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         type={opt.type}
                                                                         className="form-control input-sm"
                                                                         value={form.data[schema.name][key][opt.name]}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                               opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_object_tr_td_o_select' +
                                                                                            index +
                                                                                            child_tr_index +
                                                                                            opt_index +
                                                                                            opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_object_tr_td_o' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <input
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             '-' +
                                                                             opt_index +
                                                                             '-' +
                                                                             opt.name}
                                                                         name={schema.name +
                                                                               '-' +
                                                                               child_tr_index +
                                                                               '-' +
                                                                               opt_index +
                                                                               '-' +
                                                                               opt.name}
                                                                         ref={opt.name}
                                                                         type={opt.type}
                                                                         onChange={that._objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={form.data[schema.name][key][opt.name]}/>
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                            </tr>
                                        )
                                    }) : ''
                                }
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'array_object':
                //value = form.data[schema.name];
                //schema.isRequired = schema.required && (!value || !value.length) ? false : true;
                return (
                    <div className="fezero-form-item ant-form-item ant-row" key={'div_array_object' + index}>
                        <div className="ant-col-6 fezero-form-item-label ant-form-item-label">
                            <label htmlFor={schema.name}
                                className={required}>{schema.label}</label></div>
                        <div className={schema.col_lg ? schema.col_lg : "col-lg-11"}>
                            <table className="table table-bordered table-hover" name={schema.name} id={schema.name}>
                                <thead>
                                <tr>
                                    {schema.nonAddBtn ? null :
                                     <th style={{width: 10}}>
                                         <div className="btn-group btn-group-xs" data-id={schema.name}>
                                             <button type="button" className="btn btn-primary btn-lg"
                                                 data-id={schema.name} id={schema.name} onClick={that.addChild}>
                                                    <span className="glyphicon glyphicon-plus"
                                                        aria-hidden="true"></span>
                                             </button>
                                         </div>
                                     </th>
                                    }
                                    { schema.options ?
                                      schema.options.map(function (option, option_index) {
                                          return (
                                              <th key={'div_array_object_th_options' +
                                                       index +
                                                       option_index}>{option.label}</th>
                                          )
                                      }) : ''
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    form.data && form.data[schema.name] && schema.options ?
                                    form.data[schema.name].map(function (item, child_tr_index) {
                                        return (
                                            <tr key={'div_array_object_tr' + index + child_tr_index}>
                                                {schema.nonAddBtn ? null :
                                                 <td>
                                                     <div className="btn-group btn-group-xs"
                                                         id={schema.name + '-' + child_tr_index + '-array'}>
                                                         <button type="button"
                                                             className="btn btn-primary btn-lg"
                                                             id={schema.name + '-' + child_tr_index + '-array'}
                                                             onClick={that.removeChild}>
                                                                            <span
                                                                                className="glyphicon glyphicon-minus"></span>
                                                         </button>
                                                     </div>
                                                 </td>
                                                }
                                                {schema.options ?
                                                 schema.options.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_array_object_tr_td' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <input type={opt.type}
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             "-" +
                                                                             opt_index +
                                                                             "-" +
                                                                             opt.name}
                                                                         onChange={that.arrayAndObjectChildHandleFunc}
                                                                         disabled={ opt.disabled ||
                                                                                    (typeof(eval(schema.disabled)) ==
                                                                                     "function" ?
                                                                                     schema.disabled(form.data[schema.name],
                                                                                         form.data) :
                                                                                     false)}
                                                                         className="form-control input-sm"
                                                                         placeholder={opt.placeholder}
                                                                         name={opt.name}
                                                                         readOnly={opt.readonly ? opt.readonly : ''}
                                                                         value={item[opt.name]}/>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_array_object_tr_td' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     <select type={opt.type}
                                                                         id={schema.name +
                                                                             '-' +
                                                                             child_tr_index +
                                                                             "-" +
                                                                             opt_index +
                                                                             "-" +
                                                                             opt.name}
                                                                         onChange={that.arrayAndObjectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         name={opt.name}
                                                                         value={item[opt.name]}
                                                                         disabled={ typeof(eval(opt.disabled)) ==
                                                                                    "function" ?
                                                                                    opt.disabled(item[opt.name], item) :
                                                                                    false}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                               opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_array_object_tr_td_opt' +
                                                                                            index +
                                                                                            child_tr_index +
                                                                                            opt_index +
                                                                                            opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'date':
                                                             return (
                                                                 <td key={'div_array_object_tr_td' +
                                                                          index +
                                                                          child_tr_index +
                                                                          opt_index}>
                                                                     {
                                                                         item[opt.name] ?
                                                                         item[opt.name].format('yyyy-MM-dd hh:mm') : ''
                                                                     }
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                            </tr>
                                        )
                                    }) : ''
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                break;
        }
    }
    render () {
        const form = this.props.form;
        const that = this;
        return (
            <div className="row">
                <div className="col-lg-12">
                    <section className="panel">
                        <section className="form-box">
                        <header className="panel-header">
                            {form.title ? form.title : ''}
                        </header>
                        <div className="panel-body">
                            <div className="form">
                                <form className="fezero-form-sm" onKeyDown={this.keyDown}
                                    style={{overflow: 'visible'}}>
                                    <input type="hidden" name="_id" id="_id" value={form.data._id}/>
                                    {form.schema ?
                                     form.schema.map(function (obj, index) {
                                         return that._renderFrom(obj, index);
                                     }) : ''
                                    }
                                    {form.buttons ?
                                     <div className="form-group">
                                         {form.modal ? null : <label className="control-label col-lg-1"></label>}
                                         {
                                             that.checkFormRequired(form.schema)
                                         }
                                         {
                                             form.buttons.map(function (button, index) {
                                                 return (<button style={{marginLeft: 10}} key={'btn' + index}
                                                     className="btn btn-danger"
                                                     disabled={index == 0 && !formRequired ? 'disabled' : ''}
                                                     onClick={button.fn}
                                                     id={button.id}>{button.name}</button>)
                                             })
                                         }
                                     </div> : null
                                    }
                                </form>
                                {
                                    // form ?
                                    // this.importOrganizationModal(form) : null
                                }
                            </div>
                        </div>
                        </section>
                    </section>
                </div>
            </div>
        )
    }
}

module.exports = ReactiveForm;
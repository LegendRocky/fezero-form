import '../assets/index.less';
import '../assets/ant.css';

const React = require('react');

class ReactiveForm extends React.Component {
    constructor(props) {
        super(props);
        [
            'render',
            '_renderFrom'
        ].forEach((method) => this[method] = this[method].bind(this));
    }
    _renderFrom(schema, index) {
        const that = this;
        const form = this.props.form;
        const value = schema.name.split('.').length >
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
                            onChange={that.handleFunc} onBlur={that.saveProperty}
                            value={value}
                            defaultValue={schema.defaultValue}
                            placeholder={schema.placeholder} />
                        </div>
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
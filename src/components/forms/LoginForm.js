import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { setLoading } from '../../redux/actions/misc';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.getErrors = this.getErrors.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.updateField = this.updateField.bind(this);

        this.fields = {
            nscc_id: '',
            password: ''
        };
        this.messages = {
            text: '',
            nscc_id: '',
            password: ''
        };

        this.state = {
            fields: this.fields,
            msg: this.messages
        };
    }

    getErrors(key, display, errors) {
        let messages = [];

        if (typeof errors[key] !== typeof messages) {
            if (!errors[key]) { return null; }

            messages.push(
                <p className='help has-text-danger has-text-centered' key={`${key}-${errors[key]}`}>
                    {`[${display}] ${errors[key]}`}
                </p>
            );

            return messages;
        }

        errors[key].forEach(errorString => {
            messages.push(
                <p className='help has-text-danger has-text-centered' key={`${key}-${errorString}`}>
                    {`[${display}] ${errorString}`}
                </p>
            );
        });

        return messages;
    }

    submitLogin(event = null) {
        if (this.props.loading) { return; }

        if (event) {
            event.preventDefault();
            if (event.keyCode && (event.keyCode !== 13)) { return; }
        }

        this.setState({msg: this.messages});
        this.props.setLoading(true);

        let params = this.props.match.params;
        let route = `${this.props.api_url}/login/${params.type}`;
        let req_type = 'POST';

        axios({
            data: this.state.fields,
            method: req_type,
            timeout: 10000,
            url: route
        }).then(response => {
            this.setState({
                fields: this.fields,
                msg: this.messages
            }, () => {
                localStorage.removeItem('token');
                localStorage.setItem('token', response.headers.token);

                let decoded = jwt.decode(localStorage.getItem('token'));
                let route = `/student/${decoded.nscc_id}`;

                if (decoded.type === 'faculty') { route = '/dashboard/student'; }

                this.props.setLoading(false);
                this.props.history.push(route);
            });
        }).catch(error => {
            let msgBlock = {};

            try {
                let requiresReset = error.response.status === 300;
                let response = error.response.data;
                let token = error.response.headers.token;

                if (requiresReset) {
                    localStorage.removeItem('token');
                    localStorage.setItem('token', token);

                    this.setState({
                        fields: this.state.fields,
                        msg: this.state.msg
                    }, () => {
                        this.props.setLoading(false);
                        this.props.history.push('/password');
                    });

                    return;
                }

                // build error msg object
                if (response.validation) {
                    for (let field in response.validation) {
                        msgBlock = {
                            ...msgBlock,
                            [field]: response.validation[field]
                        };
                    }
                }

                if (response.text) { msgBlock.text = response.text; }

                // set error msg in state to display on page
                // keep values in fields
                this.setState({
                    fields: this.state.fields,
                    msg: msgBlock
                }, () => {
                    localStorage.removeItem('token');
                    this.props.setLoading(false);
                });
            } catch (exception) {
                this.setState({
                    fields: this.state.fields,
                    msg: {text: 'Request aborted'}
                }, () => {
                    localStorage.removeItem('token');
                    this.props.setLoading(false);
                });
            }
        });
    }

    updateField(event) {
        if (this.props.loading) { return; }

        this.setState({
            fields: {
                ...this.state.fields,
                [event.target.name]: event.target.value
            },
            msg: {
                ...this.state.msg,
                [event.target.name]: '',
                text: ''
            }
        });
    }

    render() {
        let params = this.props.match.params;
        let has_type = params.type && (params.type === 'student' || params.type === 'faculty');
        let is_loading = this.props.loading ? 'is-loading' : '';

        // auth check
        if (localStorage.getItem('token')) {
            let decoded = jwt.decode(localStorage.getItem('token'));
            if (!decoded.password_reset) { return <Redirect to='/dashboard/student' />; }
        }

        // check for query var
        if (!has_type) { return <Redirect to='/' />; }

        return (
            <React.Fragment>
                <form className='columns card-content' onChange={this.updateField}>
                    <div className='column is-6-desktop is-offset-3-desktop is-4-widescreen is-offset-4-widescreen'>
                        <div className='section'>
                            <h2 className='subtitle has-text-centered'>hint: try admin/alpAdmin</h2>

                            <LoginField loading={this.props.loading} msg={this.state.msg} strLabel={'ID'}
                                strName='nscc_id' strPlaceholder='W0123456'
                                strType='text'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('nscc_id', 'ID', this.state.msg)}

                            <LoginField loading={this.props.loading} msg={this.state.msg} strLabel='Password'
                                strName='password' strPlaceholder='Password'
                                strType='password'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('password', 'Password', this.state.msg)}
                        </div>

                        {this.getErrors('text', 'Error', this.state.msg)}
                    </div>
                </form>

                <div className='buttons is-centered section'>
                    <a className={`button is-danger inline ${is_loading}`}
                        onClick={() => this.props.history.push('/')}>
                        Go Back
                    </a>

                    <a className={`button is-link inline ${is_loading}`}
                        onClick={this.submitLogin}>
                        Login
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

class LoginField extends React.Component {
    render() {
        let is_danger = this.props.msg[this.props.strName] ? 'is-danger' : '';
        let is_disabled = this.props.loading ? 'is-disabled' : '';

        return (
            <div className='field'>
                <label className='label'>{this.props.strLabel}</label>
                <div className='control'>
                    <input className={`input ${is_danger} ${is_disabled}`}
                        disabled={this.props.loading ? true : false}
                        name={this.props.strName}
                        onKeyUp={this.props.submitLogin}
                        placeholder={this.props.strPlaceholder}
                        type={this.props.strType} />
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = {
    api_url: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired
};

LoginField.propTypes = {
    loading: PropTypes.bool.isRequired,
    msg: PropTypes.object,
    strLabel: PropTypes.string,
    strPlaceholder: PropTypes.string,
    strName: PropTypes.string,
    strType: PropTypes.string,
    submitLogin: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    setLoading: loading => dispatch(setLoading(loading))
});

const mapStateToProps = state => ({
    api_url: state.misc.api_url,
    loading: state.misc.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setLoading } from '../../redux/actions/misc';

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);

        this.getErrors = this.getErrors.bind(this);
        this.submitPassword = this.submitPassword.bind(this);
        this.updateField = this.updateField.bind(this);

        this.fields = {
            password: '',
            passwordConfirm: ''
        };
        this.messages = {
            password: '',
            passwordConfirm: '',
            text: ''
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

    submitPassword(event = null) {
        if (this.props.loading) { return; }

        if (event) {
            event.preventDefault();
            if (event.keyCode && (event.keyCode !== 13)) { return; }
        }

        this.setState({msg: this.messages});
        this.props.setLoading(true);

        let route = `${this.props.api_url}/password/reset`;
        let req_type = 'POST';

        axios({
            data: this.state.fields,
            headers: { 'token': localStorage.getItem('token') },
            method: req_type,
            timeout: 10000,
            url: route
        }).then(response => {
            this.setState({
                fields: this.fields,
                msg: this.messages
            }, () => {
                let decoded = jwt.decode(localStorage.getItem('token'));
                let route = `/student/${decoded.nscc_id}`;

                if (decoded.type === 'faculty') { route = '/dashboard/student'; }

                localStorage.removeItem('token');
                localStorage.setItem('token', response.headers.token);

                this.props.setLoading(false);
                this.props.history.push(route);
            });
        }).catch(error => {
            try {
                let msgBlock = {};
                let badToken = error.response.status === 401;
                let response = error.response.data;
                let token = error.response.headers.token;

                if (badToken) {
                    localStorage.removeItem('token');
                    localStorage.setItem('msg', response.text);

                    this.props.setLoading(false);
                    this.props.history.push('/');

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
                    localStorage.setItem('token', token);
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
        let is_loading = this.props.loading ? 'is-loading' : '';

        return (
            <React.Fragment>
                <form className='columns card-content' onChange={this.updateField}>
                    <div className='column is-6-desktop is-offset-3-desktop is-4-widescreen is-offset-4-widescreen'>
                        <h1 className='has-text-centered section subtitle'>
                            This account requires a password reset
                        </h1>

                        <div className='section'>
                            <PasswordField keyUp={this.submitPassword}
                                loading={this.props.loading}
                                msg={this.state.msg}
                                strLabel={'Password'}
                                strName='password'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('password', 'Password', this.state.msg)}

                            <PasswordField keyUp={this.submitPassword}
                                loading={this.props.loading}
                                msg={this.state.msg}
                                strLabel='Confirm Password'
                                strName='passwordConfirm'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('passwordConfirm', 'Confirm Password', this.state.msg)}
                        </div>

                        {this.getErrors('text', 'Error', this.state.msg)}
                    </div>
                </form>

                <div className='buttons is-centered section'>
                    <a className={`button is-danger inline ${is_loading}`}
                        onClick={() => {
                            localStorage.removeItem('token');
                            this.props.history.push('/');
                        }}>
                        Go Back
                    </a>

                    <a className={`button is-link inline ${is_loading}`}
                        onClick={this.submitPassword}>
                        Change Password
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

class PasswordField extends React.Component {
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
                        onKeyUp={this.props.keyUp}
                        placeholder={this.props.strPlaceholder}
                        type={this.props.strType} />
                </div>
            </div>
        );
    }
}

PasswordReset.propTypes = {
    api_url: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired
};

PasswordField.propTypes = {
    keyUp: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    msg: PropTypes.object,
    strLabel: PropTypes.string,
    strPlaceholder: PropTypes.string,
    strName: PropTypes.string,
    strType: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
    setLoading: loading => dispatch(setLoading(loading))
});

const mapStateToProps = state => ({
    api_url: state.misc.api_url,
    loading: state.misc.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);

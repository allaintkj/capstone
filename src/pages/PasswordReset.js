import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

// Auth actions
import {
    getPathFromToken,
    submitPasswordReset,
    logout
} from '../redux/actions/authActions';

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

        this.state = {
            fields: this.fields
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

        this.props.submitPasswordReset(this.state.fields);
    }

    updateField(event) {
        if (this.props.loading) { return; }

        this.setState({
            fields: {
                ...this.state.fields,
                [event.target.name]: event.target.value
            }
        });
    }

    render() {
        // Send back to splash page if there's no valid token
        if (!this.props.token || this.props.token.length === 0) {
            return <Redirect to='/' />;
        }
        
        if ((this.props.token) && (this.props.getPathFromToken() !== '/password')) {
            return <Redirect to={this.props.getPathFromToken()} />;
        }

        let is_loading = this.props.loading ? 'is-loading' : '';

        return (
            <div className='has-background-light'>
                <form className='columns card-content' onChange={this.updateField}>
                    <div className='column is-6-desktop is-offset-3-desktop is-4-widescreen is-offset-4-widescreen'>
                        <h1 className='has-text-centered section subtitle'>
                            This account requires a password reset
                        </h1>

                        <div className='section'>
                            <PasswordField keyUp={this.submitPassword}
                                loading={this.props.loading}
                                msg={this.props.msg}
                                strLabel={'Password'}
                                strName='password'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('password', 'Password', this.props.msg)}

                            <PasswordField keyUp={this.submitPassword}
                                loading={this.props.loading}
                                msg={this.props.msg}
                                strLabel='Confirm Password'
                                strName='passwordConfirm'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('passwordConfirm', 'Confirm Password', this.props.msg)}
                        </div>

                        {this.getErrors('text', 'Error', this.props.msg)}
                    </div>
                </form>

                <div className='buttons is-centered section'>
                    <a className={`button is-danger inline ${is_loading}`}
                        onClick={() => { this.props.logout(); }}>
                        Go Back
                    </a>

                    <a className={`button is-link inline ${is_loading}`}
                        onClick={this.submitPassword}>
                        Change Password
                    </a>
                </div>
            </div>
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
    // Auth
    loading: PropTypes.bool.isRequired,
    getPathFromToken: PropTypes.func,
    submitPasswordReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
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
    // Auth
    getPathFromToken: () => dispatch(getPathFromToken()),
    submitPasswordReset: fields => dispatch(submitPasswordReset(fields)),
    logout: () => dispatch(logout())
});

const mapStateToProps = state => ({
    // Auth
    token: state.auth.token,
    loading: state.auth.isLoading,
    // Validation
    msg: state.msg.data
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);

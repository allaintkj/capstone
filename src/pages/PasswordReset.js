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

/*
*   PasswordReset form
*/
class PasswordReset extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.getErrors = this.getErrors.bind(this);
        this.submitPassword = this.submitPassword.bind(this);
        this.updateField = this.updateField.bind(this);

        // Default fields
        this.fields = {
            password: '',
            passwordConfirm: ''
        };

        // Construct state
        this.state = {
            fields: this.fields
        };
    }

    getErrors(key, display, errors) {
        let messages = [];

        // Render validation errors and/or messages
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
            // Only submit if enter key pressed
            if (event.keyCode && (event.keyCode !== 13)) { return; }
        }

        this.props.submitPasswordReset(this.state.fields);
    }

    updateField(event) {
        if (this.props.loading) { return; }

        // Update form value
        this.setState({
            fields: {
                ...this.state.fields,
                [event.target.name]: event.target.value
            }
        });
    }

    render() {
        // Send back to login if there's no valid token
        if (!this.props.token || this.props.token.length === 0) {
            return <Redirect to='/' />;
        }
        
        // If we don't get the '/password' route back, then the password reset has been submitted
        // Move the user on to their destination
        if ((this.props.token) && (this.props.getPathFromToken() !== '/password')) {
            return <Redirect to={this.props.getPathFromToken()} />;
        }

        return (
            <div className='section has-background-light pt-3'>
                <div className='container'>
                    <form className='columns' onChange={this.updateField}>
                        <div className='column is-6-widescreen is-offset-3-widescreen'>
                            <h1 className='subtitle has-text-centered section'>
                                This account requires a password reset
                            </h1>

                            <PasswordField keyUp={this.submitPassword}
                                msg={this.props.msg}
                                strLabel={'Password'}
                                strName='password'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('password', 'Password', this.props.msg)}

                            <PasswordField keyUp={this.submitPassword}
                                msg={this.props.msg}
                                strLabel='Confirm Password'
                                strName='passwordConfirm'
                                strPlaceholder='Password'
                                strType='password' />

                            {this.getErrors('passwordConfirm', 'Confirm Password', this.props.msg)}

                            {this.getErrors('text', 'Error', this.props.msg)}
                        </div>
                    </form>

                    <div className='buttons is-centered section'>
                        <a className='button is-danger inline'
                            onClick={() => { this.props.logout(); }}>
                            Go Back
                        </a>

                        <a className='button is-link inline'
                            onClick={this.submitPassword}>
                            Change Password
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

/*
*   PasswordField component for PasswordReset form
*/
class PasswordField extends React.Component {
    render() {
        let is_danger = this.props.msg[this.props.strName] ? 'is-danger' : '';

        return (
            <div className='field'>
                <label className='label'>{this.props.strLabel}</label>
                <div className='control'>
                    <input className={`input ${is_danger}`}
                        disabled={false}
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
    getPathFromToken: PropTypes.func,
    submitPasswordReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

PasswordField.propTypes = {
    keyUp: PropTypes.func.isRequired,
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
    // Validation
    msg: state.msg.data
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);

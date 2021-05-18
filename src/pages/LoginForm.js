import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

// Auth actions
import {
    getPathFromToken,
    login
} from '../redux/actions/authActions';

// Validation actions
import {
    clearMessages
} from '../redux/actions/messageActions';

/*
*   LoginForm component
*/
class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        // Function bindings
        this.getErrors = this.getErrors.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.updateField = this.updateField.bind(this);

        // Default form field states
        this.fields = {
            nscc_id: '',
            password: ''
        };

        // Initial state
        this.state = {
            fields: this.fields
        };
    }

    getErrors(key, display, errors) {
        let messages = [];

        // Format and render any validation or general messages in state
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

        // Check for keypress
        if (event) {
            event.preventDefault();
            // Only submit the form if enter was pressed
            if (event.keyCode && (event.keyCode !== 13)) { return; }
        }

        // Submit login form
        this.props.login(this.state.fields);
    }

    updateField(event) {
        if (this.props.loading) { return; }

        // Update state with new input value
        this.setState({
            fields: {
                ...this.state.fields,
                [event.target.name]: event.target.value
            }
        });
    }

    render() {
        // Check for token
        if (this.props.token) { return <Redirect to={this.props.getPathFromToken()} />; }

        return (
            <React.Fragment>
                <form className='columns card-content has-background-light m-0' onChange={this.updateField}>
                    <div className='column is-6-desktop is-offset-3-desktop is-4-widescreen is-offset-4-widescreen'>
                        <div className='section'>
                            <h2 className='subtitle has-text-centered'>hint: try admin/alpAdmin</h2>

                            {/* Didn't really need to componentize these */}
                            <LoginField msg={this.props.msg}
                                strLabel={'ID'}
                                strName='nscc_id'
                                strPlaceholder='W0123456'
                                strType='text'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('nscc_id', 'ID', this.props.msg)}

                            <LoginField msg={this.props.msg}
                                strLabel='Password'
                                strName='password'
                                strPlaceholder='Password'
                                strType='password'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('password', 'Password', this.props.msg)}
                        </div>

                        {this.getErrors('text', 'Message', this.props.msg)}

                        <div className='buttons is-centered section'>
                            <a className='button is-link is-block'
                                onClick={this.submitLogin}>
                                Login
                            </a>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

/*
*   LoginField component for LoginForm
*/
class LoginField extends React.Component {
    render() {
        let is_danger = this.props.msg[this.props.strName] ? 'is-danger' : '';

        return (
            <div className='field'>
                <label className='label'>{this.props.strLabel}</label>
                <div className='control'>
                    <input className={`input ${is_danger}`}
                        disabled={false}
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
    // Auth
    getPathFromToken: PropTypes.func,
    token: PropTypes.string,
    // Validation
    clearMessages: PropTypes.func,
    msg: PropTypes.object
};

LoginField.propTypes = {
    msg: PropTypes.object,
    strLabel: PropTypes.string,
    strPlaceholder: PropTypes.string,
    strName: PropTypes.string,
    strType: PropTypes.string,
    submitLogin: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    getPathFromToken: () => dispatch(getPathFromToken()),
    login: (fields, userType) => dispatch(login(fields, userType)),
    // Validation actions
    clearMessages: () => dispatch(clearMessages())
});

const mapStateToProps = state => ({
    // Auth reducer
    token: state.auth.token,
    // Validation reducer
    msg: state.msg.data
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

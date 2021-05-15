import * as jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

// Auth actions
import {
    clearUserType,
    setUserType,
    login
} from '../../redux/actions/authActions';

// Validation actions
import {
    clearMessages
} from '../../redux/actions/messageActions';

/*
*
*   LoginForm component
*
*/
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

    submitLogin(event = null) {
        if (this.props.loading) { return; }

        if (event) {
            event.preventDefault();
            if (event.keyCode && (event.keyCode !== 13)) { return; }
        }

        this.props.login(this.state.fields, this.props.match.params.type);
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
        let params = this.props.match.params;
        let loadingClass = this.props.loading ? 'is-loading' : '';
        // This won't be needed when proper routing is implemented
        let has_type = params.type && (params.type === 'student' || params.type === 'faculty');

        // Check for token
        if (localStorage.getItem('token')) {
            let decoded = jwt.decode(localStorage.getItem('token'));

            // FIXME
            // This redirects to student, which fires a fetch method, which redirects to faculty
            // Figure out how to just send the user to the correct route

            if (!decoded.password_reset) { return <Redirect to='/dashboard/student' />; }

            // Send to password reset form if token contains reset flag
            if (decoded.password_reset === true) { return <Redirect to='/password' />; }
        }

        // Check for route param indicating user type
        if (!has_type) {
            return <Redirect to='/' />;
        }

        return (
            <React.Fragment>
                <form className='columns card-content' onChange={this.updateField}>
                    <div className='column is-6-desktop is-offset-3-desktop is-4-widescreen is-offset-4-widescreen'>
                        <div className='section'>
                            <h2 className='subtitle has-text-centered'>hint: try admin/alpAdmin</h2>

                            <LoginField loading={this.props.loading} msg={this.props.msg} strLabel={'ID'}
                                strName='nscc_id' strPlaceholder='W0123456'
                                strType='text'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('nscc_id', 'ID', this.props.msg)}

                            <LoginField loading={this.props.loading} msg={this.props.msg} strLabel='Password'
                                strName='password' strPlaceholder='Password'
                                strType='password'
                                submitLogin={this.submitLogin} />

                            {this.getErrors('password', 'Password', this.props.msg)}
                        </div>

                        {this.getErrors('text', 'Error', this.props.msg)}
                    </div>
                </form>

                <div className='buttons is-centered section'>
                    <a className={`button is-danger inline ${loadingClass}`}
                        onClick={() => {
                            this.props.clearUserType();
                            this.props.clearMessages();
                            this.props.history.push('/');
                        }}>
                        Go Back
                    </a>

                    <a className={`button is-link inline ${loadingClass}`}
                        onClick={this.submitLogin}>
                        Login
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

/*
*
*   LoginField component
*
*/
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
    // React router
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    // Auth
    clearUserType: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    // Validation
    clearMessages: PropTypes.func,
    msg: PropTypes.object
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
    // Auth
    clearUserType: () => dispatch(clearUserType()),
    setUserType: userType => dispatch(setUserType(userType)),
    login: fields => dispatch(login(fields)),
    // Validation
    clearMessages: () => dispatch(clearMessages())
});

const mapStateToProps = state => ({
    // Auth reducer
    loading: state.auth.isLoading,
    userType: state.auth.userType,
    // Validation reducer
    msg: state.msg.data
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

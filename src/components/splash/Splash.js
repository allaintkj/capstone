import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import { setUserType } from '../../redux/actions/authActions';

class Splash extends React.Component {
    constructor() {
        super();

        this.getMsg = this.getMsg.bind(this);
    }

    getMsg() {
        let msg = 'Student and faculty login';
        let storedMsg = localStorage.getItem('msg');

        if (storedMsg) {
            localStorage.removeItem('msg');
            msg = <span className='has-text-danger'>{storedMsg}</span>;
        }

        return msg;
    }

    render() {
        // auth check
        if (localStorage.getItem('token')) { return <Redirect to='/dashboard/student' />; }

        return (
            <React.Fragment>
                <div className='card-content has-text-centered'>
                    <div className='section'>
                        <h2 className='subtitle'>{this.getMsg()}</h2>
                        <h2 className='subtitle'>Please click one of the buttons below to sign in</h2>
                    </div>

                    <div className='section buttons is-centered'>
                        <Link className='button is-link inline' onClick={() => {
                            this.props.setUserType('student');
                        }} to={{pathname: '/login/student'}}>
                            Student
                        </Link>

                        <Link className='button is-info inline' onClick={() => {
                            this.props.setUserType('faculty');
                        }} to={{pathname: '/login/faculty'}}>
                            Faculty
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

Splash.propTypes = {
    setUserType: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    setUserType: userType => dispatch(setUserType(userType))
});

export default connect(null, mapDispatchToProps)(Splash);

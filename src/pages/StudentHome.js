import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router';

import StudentInformation from '../components/StudentInformation';

// Auth actions
import {
    logout
} from '../redux/actions/authActions';

class StudentHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Check for token
        if ((!this.props.token) || this.props.token.length == 0) { return <Redirect to='/' />; }

        return (
            <div className='container section'>

                <StudentInformation />

                <div className='section has-text-centered'>
                    <a className='button is-link' onClick={() => this.props.logout()}>
                        {'Logout'}
                    </a>
                </div>

            </div>
        );
    }
}

StudentHome.propTypes = {
    // Auth
    token: PropTypes.string,
    logout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    logout: fields => dispatch(logout(fields))
});

const mapStateToProps = state => ({
    // Auth reducer
    token: state.auth.token,
    // Student reducer
    student: state.student
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentHome));

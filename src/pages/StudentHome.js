import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router';

// Auth actions
import {
    logout
} from '../redux/actions/authActions';

// Student actions
import {
    fetchStudent
} from '../redux/actions/studentActions';

class StudentHome extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Execute Redux action to populate state with this student
        this.props.fetchStudent(this.props.match.params.id);
    }

    render() {
        // Check for token
        if ((!this.props.token) || this.props.token.length == 0) { return <Redirect to='/' />; }

        return (
            <div className='container section'>

                <h1 className='title'>
                    {'Student Information'}
                </h1>

                <div>
                    <label className='has-text-weight-bold'>{'ID:'}</label>
                    <p className='info-string'>{this.props.student.nscc_id}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'First Name:'}</label>
                    <p className='info-string'>{this.props.student.first_name}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Last Name:'}</label>
                    <p className='info-string'>{this.props.student.last_name}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Start Date:'}</label>
                    <p className='info-string'>{this.props.student.start_date}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'End Date:'}</label>
                    <p className='info-string'>{this.props.student.end_date}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Advisor:'}</label>
                    <p className='info-string'>{this.props.student.advisor}</p>
                </div>

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
    logout: PropTypes.func.isRequired,
    // Student
    fetchStudent: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    // React router
    match: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    logout: fields => dispatch(logout(fields)),
    // Student actions
    fetchStudent: nscc_id => dispatch(fetchStudent(nscc_id))
});

const mapStateToProps = state => ({
    // Auth reducer
    token: state.auth.token,
    // Student reducer
    student: state.student
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentHome));

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router';

import StudentInformation from '../components/StudentInformation';

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
            <div className='has-background-light'>
                <div className='container section'>

                    <StudentInformation visible={true} />

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
    fetchStudent: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    logout: fields => dispatch(logout(fields)),
    // Student actions
    fetchStudent: nscc_id => dispatch(fetchStudent(nscc_id))
});

const mapStateToProps = state => ({
    // Auth reducer
    token: state.auth.token
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentHome));

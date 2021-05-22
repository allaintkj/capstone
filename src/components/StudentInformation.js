import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ProgressChart from './ProgressChart';
import LogoutButton from './LogoutButton';

// Progress actions
import {
    fetchStudentProgress
} from '../redux/actions/progressActions';

/*
*   StudentInformation panel, displayed on StudentHome and AdmimDashboard
*/
class StudentInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(lastProps) {
        let lastStudent = lastProps.student.nscc_id;
        let thisStudent = this.props.student.nscc_id;

        // Run progress request if student changed
        if (lastStudent !== thisStudent) { this.props.fetchStudentProgress(thisStudent); }
    }

    render() {
        // Don't need to auth check here
        // StudentHome and AdminDashboard will take care of it

        // Visibility disabled if user is viewing CourseList and not StudentList
        if (!this.props.visible) { return null; }

        // Check for a proper student ID
        if (this.props.student.nscc_id.length != 8) {
            return (
                <React.Fragment>

                    <h1 className='title'>
                        {'Student Information'}
                    </h1>

                    <div>
                        <label className='has-text-weight-bold'>{'No student selected'}</label>
                        <p className='info-string'>{'Select a student to see their record'}</p>
                    </div>

                    <LogoutButton />

                </React.Fragment>
            );
        }

        return (
            <React.Fragment>

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

                <ProgressChart />

                <LogoutButton />

            </React.Fragment>
        );
    }
}

StudentInformation.propTypes = {
    visible: PropTypes.bool,
    // Student
    student: PropTypes.object.isRequired,
    fetchStudentProgress: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    // Student actions
    fetchStudentProgress: nscc_id => dispatch(fetchStudentProgress(nscc_id))
});

const mapStateToProps = state => ({
    // Student reducer
    student: state.student
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentInformation);

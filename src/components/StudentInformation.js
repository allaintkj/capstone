import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LogoutButton from './LogoutButton';

class StudentInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.visible) { return null; }

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

                <LogoutButton />

            </React.Fragment>
        );
    }
}

StudentInformation.propTypes = {
    visible: PropTypes.bool,
    student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student
});

export default connect(mapStateToProps)(StudentInformation);

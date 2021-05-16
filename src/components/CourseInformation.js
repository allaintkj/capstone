import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class CourseInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.course.course_code.length != 8) {
            return (
                <React.Fragment>

                    <h1 className='title'>
                        {'Course Information'}
                    </h1>

                    <div>
                        <label className='has-text-weight-bold'>{'No course selected'}</label>
                        <p className='info-string'>{'Select a course to see details'}</p>
                    </div>

                </React.Fragment>
            );
        }

        return (
            <React.Fragment>

                <h1 className='title'>
                    {'Course Information'}
                </h1>

                <div>
                    <label className='has-text-weight-bold'>{'Course Code:'}</label>
                    <p className='info-string'>{this.props.course.course_code}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Course Name:'}</label>
                    <p className='info-string'>{this.props.course.course_name}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Course Description:'}</label>
                    <p className='info-string'>{this.props.course.course_desc}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Number of Credits:'}</label>
                    <p className='info-string'>{this.props.course.number_credits}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Number of Units:'}</label>
                    <p className='info-string'>{this.props.course.number_units}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Comments:'}</label>
                    <p className='info-string'>{this.props.course.comment}</p>
                </div>

            </React.Fragment>
        );
    }
}

CourseInformation.propTypes = {
    // Course
    course: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    // Course reducer
    course: state.course
});

export default connect(mapStateToProps)(CourseInformation);
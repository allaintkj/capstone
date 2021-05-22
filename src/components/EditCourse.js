import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import LogoutButton from './LogoutButton';

// Course actions
import {
    updateCourse,
    deleteCourse
} from '../redux/actions/courseActions';

/*
*   EditCourse form displayed on AdminDashboard
*/
class EditCourse extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);

        // Default form state
        this.course = {
            comment: '',
            course_code: '',
            course_desc: '',
            course_name: '',
            number_credits: 0,
            number_units: 0
        };

        // Default form state
        this.state = {
            course: this.course
        };
    }

    componentDidUpdate(lastProps) {
        let lastCourse = lastProps.match.params.id;
        let thisCourse = this.props.match.params.id;

        // Empty list prop so it doesn't get submitted with the form
        if (lastCourse !== thisCourse) {
            // New course selected
            // Set new course in state
            this.setState({
                course: {
                    ...this.props.course,
                    list: null
                }
            });
        }
    }

    fieldUpdate(event) {
        // Default to redux prop
        let courseModel = this.props.course;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        // Use state if the form has been edited
        if (this.state.course.course_code.length === 8) {
            courseModel = this.state.course;
        }

        // Set state with appropriate object and update form value
        // Verify list is empty
        this.setState({
            course: {
                ...courseModel,
                [event.target.name]: value,
                list: null
            }
        });
    }

    getErrors(key, display, errors) {
        let messages = [];

        // Display validation messages
        if (typeof errors[key] !== typeof messages) {
            if (!errors[key]) { return null; }

            messages.push(
                <p className='help has-text-danger has-text-centered p-2 has-background-white' key={`${key}-${errors[key]}`}>
                    {`[${display}] ${errors[key]}`}
                </p>
            );

            return messages;
        }

        errors[key].forEach(errorString => {
            messages.push(
                <p className='help has-text-danger has-text-centered p-2 has-background-white' key={`${key}-${errorString}`}>
                    {`[${display}] ${errorString}`}
                </p>
            );
        });

        return messages;
    }

    render() {
        // Only display on correct route ('edit')
        if (!this.props.visible) { return null; }

        // Check for valid course ID
        if (this.props.course.course_code.length !== 8) {
            return (
                <React.Fragment>

                    <h1 className='title'>
                        {'Edit Course'}
                    </h1>

                    <div>
                        <label className='has-text-weight-bold'>{'No course selected'}</label>
                        <p className='info-string'>{'Select a course to edit details'}</p>
                    </div>

                    <LogoutButton />

                </React.Fragment>
            );
        }

        // Default to redux prop
        let courseModel = this.props.course;

        // Use state if the form has been edited
        if (this.state.course.course_code.length === 8) {
            courseModel = this.state.course;
        }

        return (
            <React.Fragment>
                <h1 className='title'>{'Edit Course'}</h1>

                <form>
                    <div className='columns'>
                        <div className='column is-6-desktop'>
                            <label className='label'>Course Code</label>
                            <div className='control'>
                                <input className={'input' + (this.props.msg.course_code ? ' is-danger' : '')}
                                    disabled={true}
                                    maxLength={8}
                                    name='course_code'
                                    onChange={this.fieldUpdate}
                                    placeholder='WEBD3000'
                                    type='text'
                                    value={courseModel.course_code} />
                            </div>

                            {this.getErrors('course_code', 'Course Code', this.props.msg)}
                        </div>

                        <div className='column is-6-desktop'>
                            <label className='label'>Course Name</label>
                            <div className='control'>
                                <input className={'input' + (this.props.msg.course_name ? ' is-danger' : '')}
                                    name='course_name'
                                    onChange={this.fieldUpdate}
                                    placeholder='Web Application Programming'
                                    type='text'
                                    value={courseModel.course_name} />
                            </div>

                            {this.getErrors('course_name', 'Course Name', this.props.msg)}
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column is-6-desktop'>
                            <label className='label'>Number of Units</label>
                            <div className='control is-fullwidth'>
                                <input className={'input' + (this.props.msg.number_units ? ' is-danger' : '')}
                                    name='number_units'
                                    onChange={this.fieldUpdate}
                                    placeholder=''
                                    type='number'
                                    value={courseModel.number_units} />
                            </div>

                            {this.getErrors('number_units', 'Number of Units', this.props.msg)}
                        </div>

                        <div className='column is-6-desktop'>
                            <label className='label'>Number of Credits</label>
                            <div className='control is-fullwidth'>
                                <input className={'input' + (this.props.msg.number_credits ? ' is-danger' : '')}
                                    name='number_credits'
                                    onChange={this.fieldUpdate}
                                    placeholder=''
                                    type='number'
                                    value={courseModel.number_credits} />
                            </div>

                            {this.getErrors('number_credits', 'Number of Credits', this.props.msg)}
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label'>Description</label>
                            <div className='control'>
                                <input className={'input' + (this.props.msg.course_desc ? ' is-danger' : '')}
                                    name='course_desc'
                                    onChange={this.fieldUpdate}
                                    placeholder='Web Application Programming'
                                    type='text'
                                    value={courseModel.course_desc} />
                            </div>

                            {this.getErrors('course_desc', 'Course Description', this.props.msg)}
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label'>Notes</label>
                            <div className='control'>
                                <textarea className='textarea' name='comment'
                                    onChange={this.fieldUpdate}
                                    placeholder='Add a comment..' rows='7'
                                    style={{resize: 'none'}}
                                    value={courseModel.comment} />
                            </div>
                        </div>
                    </div>
                </form>

                {this.getErrors('text', 'Message', this.props.msg)}

                <div className='columns is-desktop is-centered mt-6'>

                    <div className='column'>
                        <a className='button is-danger is-block'
                            disabled={false}
                            onClick={() => {
                                /* eslint-disable */
                                let confirmStatus = confirm('Are you sure you wish to delete this course record?');
                                if (confirmStatus) {
                                    this.props.deleteCourse(this.props.course.course_code);
                                    this.setState({ course: this.course });
                                }
                                /* eslint-enable */
                            }}>

                            Delete

                        </a>
                    </div>

                    <div className='column'>
                        <a className='button is-success is-block'
                            disabled={false}
                            onClick={() => {
                                /* eslint-disable */
                                let confirmStatus = confirm('Are you sure you wish to update this course record?');
                                if (confirmStatus) {
                                    this.props.updateCourse(this.state.course);
                                    this.setState({ course: this.course });
                                }
                                /* eslint-enable */
                            }}>

                            Save

                        </a>
                    </div>
                    
                </div>

                <LogoutButton />

            </React.Fragment>
        );
    }
}

EditCourse.propTypes = {
    visible: PropTypes.bool,
    // Router
    match: PropTypes.object.isRequired,
    // Message
    msg: PropTypes.object,
    // Course
    course: PropTypes.object.isRequired,
    updateCourse: PropTypes.func.isRequired,
    deleteCourse: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Course actions
    updateCourse: form => dispatch(updateCourse(form)),
    deleteCourse: course_code => dispatch(deleteCourse(course_code))
});

const mapStateToProps = state => ({
    // Message reducer
    msg: state.msg.data,
    // Course reducer
    course: state.course
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCourse));

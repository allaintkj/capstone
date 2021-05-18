import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import LogoutButton from '../components/LogoutButton';

// Course actions
import {
    addCourse
} from '../redux/actions/courseActions';

/*
*   AddCourse form page
*/
class AddCourse extends React.Component {
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

        // Construct state
        this.state = {
            course: this.course
        };
    }

    fieldUpdate(event) {
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        // Update form field value
        this.setState({
            course: {
                ...this.state.course,
                [event.target.name]: value,
                list: null
            }
        });
    }

    getErrors(key, display, errors) {
        let messages = [];

        // Render validation errors
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
        // Auth check
        if (!this.props.token) { return <Redirect to='/' />; }

        // Return the user to the dashboard if they've just added a course
        if (this.props.msg.text === 'Course added successfully') { return <Redirect to='/admin/course' />; }

        return (
            <div className='has-background-light'>
                <div className='container section'>
                    <h1 className='title'>{'Edit Course'}</h1>
                    <form>
                        <div className='columns'>
                            <div className='column is-6-desktop'>
                                <label className='label'>Course Code</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.course_code ? ' is-danger' : '')}
                                        disabled={false}
                                        maxLength={8}
                                        name='course_code'
                                        onChange={this.fieldUpdate}
                                        placeholder='WEBD3000'
                                        type='text'
                                        value={this.state.course.course_code} />
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
                                        value={this.state.course.course_name} />
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
                                        value={this.state.course.number_units} />
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
                                        value={this.state.course.number_credits} />
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
                                        value={this.state.course.course_desc} />
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
                                        value={this.state.course.comment} />
                                </div>
                            </div>
                        </div>
                    </form>

                    {this.getErrors('text', 'Message', this.props.msg)}

                    <div className='columns is-desktop is-centered mt-6'>
                        <div className='column'>
                            <a className='button is-info is-block'
                                disabled={false}
                                href='/admin/course'
                                onClick={() => { this.setState({ course: this.course }); }}>

                                Cancel

                            </a>
                        </div>

                        <div className='column'>
                            <a className='button is-success is-block'
                                disabled={false}
                                onClick={() => { this.props.addCourse(this.state.course); }}>

                                Save

                            </a>
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            </div>
        );
    }
}

AddCourse.propTypes = {
    // Message
    msg: PropTypes.object,
    // Course
    addCourse: PropTypes.func.isRequired,
    // Auth
    token: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Course actions
    addCourse: form => dispatch(addCourse(form))
});

const mapStateToProps = state => ({
    // Message
    msg: state.msg.data,
    // Auth
    token: state.auth.token
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCourse);

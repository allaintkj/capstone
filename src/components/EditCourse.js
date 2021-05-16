import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class EditCourse extends React.Component {
    constructor(props) {
        super(props);

        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);

        this.course = {
            comment: '',
            course_code: '',
            course_desc: '',
            course_name: '',
            number_credits: 0,
            number_units: 0
        };

        this.state = {
            course: this.course
        };
    }

    fieldUpdate(event) {
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        let course = this.state.course;

        if (!this.props.add) { this.activateSelected(); }

        this.setState({
            course: {
                ...course,
                [event.target.name]: value
            }
        });
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

    render() {
        if (!this.props.visible) { return null; }

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
                                    value={this.props.course.course_code} />
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
                                    value={this.props.course.course_name} />
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
                                    value={this.props.course.number_units} />
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
                                    value={this.props.course.number_credits} />
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
                                    value={this.props.course.course_desc} />
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
                                    value={this.props.course.comment} />
                            </div>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

EditCourse.propTypes = {
    visible: PropTypes.bool,
    // Validation
    msg: PropTypes.object,
    // Courses
    course: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    // Validation reducer
    msg: state.msg.data,
    // Student reducer
    course: state.course
});

export default withRouter(connect(mapStateToProps)(EditCourse));

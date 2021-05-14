import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setForm } from '../../redux/actions/misc';

class CourseForm extends React.Component {
    constructor(props) {
        super(props);

        this.activateSelected = this.activateSelected.bind(this);
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);
        this.setErrors = this.setErrors.bind(this);

        this.cleared = false;
        this.edited = false;
        this.msg = {
            bottom: '',
            comment: '',
            course_code: '',
            course_desc: '',
            course_name: '',
            number_credits: '',
            number_units: ''
        };
        this.course = {
            comment: '',
            course_code: '',
            course_desc: '',
            course_name: '',
            number_credits: 0,
            number_units: 0
        };

        this.state = {
            msg: this.msg,
            course: this.course
        };
    }

    activateSelected() {
        if (this.edited) { return; }

        let array = this.props.array;
        let params = this.props.match.params;
        let course;

        this.cleared = false;
        this.edited = true;

        for (let key of array) {
            if (key.course_code === params.id) {
                course = key;
            }
        }

        this.setState({
            course: course,
            msg: this.msg
        }, () => this.props.setForm(this.state.course));
    }

    clear() {
        if (this.cleared) { return; }

        this.cleared = true;
        this.edited = false;

        this.setState({course: this.course}, () => this.props.setForm(this.state.course));
    }

    componentDidUpdate(prevProps) {
        let new_id = prevProps.match.params.id !== this.props.match.params.id;
        let new_errors = (prevProps.errors !== this.props.errors) && this.props.errors;

        if (new_id) {
            this.cleared = false;
            this.edited = false;
        }

        if (this.props.show) {
            if (this.props.array) {
                if (!this.props.add) { this.activateSelected(); }
                if (this.props.add) { this.clear(); }
            }

            if (new_errors) { this.setErrors(); }
        }
    }

    fieldUpdate(event) {
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        let course = this.state.course;

        if (!this.props.add) { this.activateSelected(); }

        this.setState({
            msg: {
                ...this.state.msg,
                [event.target.name]: '',
                bottom: ''
            },
            course: {
                ...course,
                [event.target.name]: value
            }
        }, () => this.props.setForm(this.state.course));
    }

    getErrors(key, display) {
        let messages = [];

        if (typeof this.state.msg[key] !== typeof messages) {
            if (!this.state.msg[key]) { return null; }

            messages.push(
                <p className='help has-text-danger has-text-centered' key={`${key}-${this.state.msg[key]}`}>
                    {`[${display}] ${this.state.msg[key]}`}
                </p>
            );

            return messages;
        }

        this.state.msg[key].forEach(errorString => {
            messages.push(
                <p className='help has-text-danger has-text-centered' key={`${key}-${errorString}`}>
                    {`[${display}] ${errorString}`}
                </p>
            );
        });

        return messages;
    }

    setErrors() {
        if (this.props.show && this.props.errors) {
            this.setState({msg: this.props.errors});
        }
    }

    render() {
        if (!this.props.show) { return null; }

        return (
            <React.Fragment>
                <h1 className='title'>{(this.props.add ? 'Add' : 'Edit') + ' a Course'}</h1>

                <form>
                    <div className='columns'>
                        <div className='column is-6-desktop'>
                            <label className='label'>Course Code</label>
                            <div className='control'>
                                <input className='input'
                                    disabled={!this.props.add}
                                    maxLength={8}
                                    name='course_code'
                                    onChange={this.fieldUpdate}
                                    placeholder='WEBD3000'
                                    type='text'
                                    value={this.state.course.course_code} />
                            </div>

                            {this.getErrors('course_code', 'Course Code')}
                        </div>

                        <div className='column is-6-desktop'>
                            <label className='label'>Course Name</label>
                            <div className='control'>
                                <input className='input'
                                    name='course_name'
                                    onChange={this.fieldUpdate}
                                    placeholder='Web Application Programming'
                                    type='text'
                                    value={this.state.course.course_name} />
                            </div>

                            {this.getErrors('course_name', 'Course Name')}
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column is-6-desktop'>
                            <label className='label'>Number of Units</label>
                            <div className='control is-fullwidth'>
                                <input className='input'
                                    name='number_units'
                                    onChange={this.fieldUpdate}
                                    placeholder=''
                                    type='number'
                                    value={this.state.course.number_units} />
                            </div>

                            {this.getErrors('number_units', 'Number of Units')}
                        </div>

                        <div className='column is-6-desktop'>
                            <label className='label'>Number of Credits</label>
                            <div className='control is-fullwidth'>
                                <input className='input'
                                    name='number_credits'
                                    onChange={this.fieldUpdate}
                                    placeholder=''
                                    type='number'
                                    value={this.state.course.number_credits} />
                            </div>

                            {this.getErrors('number_credits', 'Number of Credits')}
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label'>Description</label>
                            <div className='control'>
                                <input className='input'
                                    name='course_desc'
                                    onChange={this.fieldUpdate}
                                    placeholder='Web Application Programming'
                                    type='text'
                                    value={this.state.course.course_desc} />
                            </div>

                            {this.getErrors('course_desc', 'Course Description')}
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
            </React.Fragment>
        );
    }
}

CourseForm.propTypes = {
    add: PropTypes.bool.isRequired,
    array: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.object,
    setForm: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
    setForm: course => dispatch(setForm(course))
});

export default withRouter(connect(null, mapDispatchToProps)(CourseForm));

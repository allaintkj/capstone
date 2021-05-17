import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import LogoutButton from './LogoutButton';

// Student actions
import {
    updateStudent
} from '../redux/actions/studentActions';

class EditStudent extends React.Component {
    constructor(props) {
        super(props);

        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);

        this.state = {
            student: {
                active: true,
                advisor: '',
                comment: '',
                nscc_id: '',
                start_date: '',
                end_date: '',
                first_name: '',
                last_name: '',
                progress: {}
            }
        };
    }

    componentDidUpdate(lastProps) {
        let lastStudent = lastProps.match.params.id;
        let thisStudent = this.props.match.params.id;

        if (lastStudent !== thisStudent) {
            this.setState({
                student: {
                    ...this.props.student,
                    list: null
                }
            });
        }
    }

    fieldUpdate(event) {
        let studentModel = this.props.student;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        if (this.state.student.nscc_id.length === 8) {
            studentModel = this.state.student;
        }

        this.setState({
            student: {
                ...studentModel,
                [event.target.name]: value,
                list: null
            }
        });
    }

    getErrors(key, display, errors) {
        let messages = [];

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
        if (!this.props.visible) { return null; }
        if (this.props.student.nscc_id.length !== 8) {
            return (
                <React.Fragment>

                    <h1 className='title'>
                        {'Edit Student'}
                    </h1>

                    <div>
                        <label className='has-text-weight-bold'>{'No student selected'}</label>
                        <p className='info-string'>{'Select a student to edit their record'}</p>
                    </div>

                    <LogoutButton />

                </React.Fragment>
            );
        }

        let studentModel = this.props.student;

        if (this.state.student.nscc_id.length === 8) {
            studentModel = this.state.student;
        }

        return (
            <React.Fragment>
                <h1 className='title'>{'Edit Student'}</h1>

                <form>
                    <div className='columns'>
                        <div className='column'>
                            <div className='field'>
                                <label className='label'>W Number</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.nscc_id ? ' is-danger' : '')}
                                        disabled={true}
                                        name='nscc_id'
                                        onChange={this.fieldUpdate}
                                        placeholder='W1234567'
                                        type='text'
                                        value={studentModel.nscc_id}
                                    />
                                </div>

                                {this.getErrors('nscc_id', 'ID', this.props.msg)}
                            </div>

                            <div className='field'>
                                <label className='label'>Advisor</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.advisor ? ' is-danger' : '')}
                                        name='advisor'
                                        onChange={this.fieldUpdate}
                                        placeholder='Jane Doe'
                                        type='text'
                                        value={studentModel.advisor}
                                    />
                                </div>

                                {this.getErrors('advisor', 'Advisor', this.props.msg)}
                            </div>
                        </div>

                        <div className='column'>
                            <div className='field'>
                                <label className='label'>First Name</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.first_name ? ' is-danger' : '')}
                                        name='first_name'
                                        onChange={this.fieldUpdate}
                                        placeholder='John'
                                        type='text'
                                        value={studentModel.first_name}
                                    />
                                </div>

                                {this.getErrors('first_name', 'First Name', this.props.msg)}
                            </div>

                            <div className='field'>
                                <label className='label'>Last Name</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.last_name ? ' is-danger' : '')}
                                        name='last_name'
                                        onChange={this.fieldUpdate}
                                        placeholder='Doe'
                                        type='text'
                                        value={studentModel.last_name}
                                    />
                                </div>

                                {this.getErrors('last_name', 'Last Name', this.props.msg)}
                            </div>
                        </div>

                        <div className='column'>
                            <div className='field'>
                                <label className='label'>Start Date</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.start_date ? ' is-danger' : '')}
                                        name='start_date'
                                        onChange={this.fieldUpdate}
                                        type='date'
                                        value={studentModel.start_date}
                                    />
                                </div>

                                {this.getErrors('start_date', 'Start Date', this.props.msg)}
                            </div>

                            <div className='field'>
                                <label className='label'>End Date</label>
                                <div className='control'>
                                    <input className={'input' + (this.props.msg.end_date ? ' is-danger' : '')}
                                        name='end_date'
                                        onChange={this.fieldUpdate}
                                        type='date'
                                        value={studentModel.end_date}
                                    />
                                </div>

                                {this.getErrors('end_date', 'End Date', this.props.msg)}
                            </div>
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
                                    value={studentModel.comment} />
                            </div>
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label is-flex is-justify-content-space-between'>
                                Currently Active
                                <input checked={studentModel.active}
                                    name='active'
                                    onChange={this.fieldUpdate}
                                    type='checkbox' />
                            </label>
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label is-flex is-justify-content-space-between'>
                                Password Reset

                                <input
                                    name='password_reset_req'
                                    onChange={this.fieldUpdate}
                                    type='checkbox'
                                />
                            </label>
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
                                let confirmStatus = confirm('Are you sure you wish to delete this student record?');
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
                                let confirmStatus = confirm('Are you sure you wish to update this student record?');
                                /* eslint-enable */

                                if (confirmStatus) { this.props.updateStudent(this.state.student); }
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

EditStudent.propTypes = {
    match: PropTypes.object,
    visible: PropTypes.bool,
    // Validation
    msg: PropTypes.object,
    // Students
    student: PropTypes.object.isRequired,
    updateStudent: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Student actions
    updateStudent: form => dispatch(updateStudent(form))
});

const mapStateToProps = state => ({
    // Validation reducer
    msg: state.msg.data,
    // Student reducer
    student: state.student
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditStudent));

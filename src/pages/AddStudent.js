import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import LogoutButton from '../components/LogoutButton';

// Student actions
import {
    addStudent
} from '../redux/actions/studentActions';

/*
*   AddStudent form page
*/
class AddStudent extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);

        // Default student state
        this.student = {
            active: true,
            advisor: '',
            comment: '',
            nscc_id: '',
            start_date: '',
            end_date: '',
            first_name: '',
            last_name: '',
            progress: {}
        };

        // Construct state
        this.state = {
            student: this.student
        };
    }

    fieldUpdate(event) {
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        // Update form values
        this.setState({
            student: {
                ...this.state.student,
                [event.target.name]: value,
                list: null
            }
        });
    }

    getErrors(key, display, errors) {
        let messages = [];

        // Render validation messages
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
        // Check for authentication
        if (!this.props.token) { return <Redirect to='/' />; }

        // Send user back to dashboard if they've just added a student
        // So they're not stuck on this form
        if (this.props.msg.text === 'User added successfully') { return <Redirect to='/admin/student' />; }

        return (
            <div className='has-background-light'>
                <div className='container section'>
                    <h1 className='title'>{'Add Student'}</h1>

                    <form>
                        <div className='columns'>
                            <div className='column'>
                                <div className='field'>
                                    <label className='label'>W Number</label>
                                    <div className='control'>
                                        <input className={'input' + (this.props.msg.nscc_id ? ' is-danger' : '')}
                                            disabled={false}
                                            name='nscc_id'
                                            onChange={this.fieldUpdate}
                                            placeholder='W1234567'
                                            type='text'
                                            value={this.state.student.nscc_id}
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
                                            value={this.state.student.advisor}
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
                                            value={this.state.student.first_name}
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
                                            value={this.state.student.last_name}
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
                                            value={this.state.student.start_date}
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
                                            value={this.state.student.end_date}
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
                                        value={this.state.student.comment} />
                                </div>
                            </div>
                        </div>

                        <div className='columns'>
                            <div className='column'>
                                <label className='label is-flex is-justify-content-space-between'>
                                    Currently Active
                                    <input checked={this.state.student.active}
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
                            <a className='button is-info is-block'
                                disabled={false}
                                href='/admin/student'
                                /* Clear any possible form data from state */
                                onClick={() => { this.setState({ student: this.student }); }}>

                                Cancel

                            </a>
                        </div>

                        <div className='column'>
                            <a className='button is-success is-block'
                                disabled={false}
                                /* Submit form to API */
                                onClick={() => { this.props.addStudent(this.state.student); }}>

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

AddStudent.propTypes = {
    // Message
    msg: PropTypes.object,
    // Student
    addStudent: PropTypes.func.isRequired,
    // Auth
    token: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Student actions
    addStudent: form => dispatch(addStudent(form))
});

const mapStateToProps = state => ({
    // Message reducer
    msg: state.msg.data,
    // Auth reducer
    token: state.auth.token
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);

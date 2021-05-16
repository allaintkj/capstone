import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class EditStudent extends React.Component {
    constructor(props) {
        super(props);

        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);

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

        this.state = {
            student: this.student
        };
    }

    fieldUpdate(event) {
        let student = this.state.student;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        this.setState({
            student: {
                ...student,
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
                                        value={this.props.student.nscc_id}
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
                                        value={this.props.student.advisor}
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
                                        value={this.props.student.first_name}
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
                                        value={this.props.student.last_name}
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
                                        value={this.props.student.start_date}
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
                                        value={this.props.student.end_date}
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
                                    value={this.props.student.comment} />
                            </div>
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label is-flex' style={{'justifyContent': 'space-between'}}>
                                Currently Active
                                <input checked={this.props.student.active}
                                    name='active'
                                    onChange={this.fieldUpdate}
                                    type='checkbox' />
                            </label>
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label is-flex' style={{'justifyContent': 'space-between'}}>
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
            </React.Fragment>
        );
    }
}

EditStudent.propTypes = {
    visible: PropTypes.bool,
    // Validation
    msg: PropTypes.object,
    // Students
    student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    // Validation reducer
    msg: state.msg.data,
    // Student reducer
    student: state.student
});

export default withRouter(connect(mapStateToProps)(EditStudent));

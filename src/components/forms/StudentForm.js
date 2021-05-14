import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ProgressChart from '../progress/ProgressChart';

import { setForm } from '../../redux/actions/misc';

class StudentForm extends React.Component {
    constructor(props) {
        super(props);

        this.activateSelected = this.activateSelected.bind(this);
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.getErrors = this.getErrors.bind(this);
        this.setErrors = this.setErrors.bind(this);

        this.cleared = false;
        this.edited = false;
        this.msg = {
            active: '',
            advisor: '',
            bottom: '',
            comment: '',
            nscc_id: '',
            start_date: '', end_date: '',
            first_name: '',
            last_name: ''
        };
        this.student = {
            active: true,
            advisor: '',
            comment: '',
            nscc_id: '',
            start_date: '', end_date: '',
            first_name: '',
            last_name: '',
            progress: {}
        };

        this.state = {
            msg: this.msg,
            student: this.student
        };
    }

    activateSelected() {
        if (this.edited) { return; }

        let array = this.props.array;
        let params = this.props.match.params;
        let student;

        this.cleared = false;
        this.edited = true;

        for (let key of array) {
            if (key.nscc_id === params.id) {
                student = key;
            }
        }

        this.setState({
            msg: this.msg,
            student: student
        }, () => this.props.setForm(this.state.student));
    }

    clear() {
        if (this.cleared) { return; }

        this.cleared = true;
        this.edited = false;

        this.setState({student: this.student}, () => this.props.setForm(this.state.student));
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
        let student = this.state.student;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        if (!this.props.add) { this.activateSelected(); }

        this.setState({
            msg: {
                ...this.state.msg,
                [event.target.name]: '',
                bottom: ''
            },
            student: {
                ...student,
                [event.target.name]: value
            }
        }, () => this.props.setForm(this.state.student));
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
        if (!this.props.show || !this.state.student) { return null; }

        return (
            <React.Fragment>
                <h1 className='title'>{(this.props.add ? 'Add' : 'Edit') + ' a Student'}</h1>

                <form>
                    <div className='columns'>
                        <div className='column'>
                            <div className='field'>
                                <label className='label'>W Number</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.nscc_id ? ' is-danger' : '')}
                                        disabled={!this.props.add}
                                        name='nscc_id'
                                        onChange={this.fieldUpdate}
                                        placeholder='W1234567'
                                        type='text'
                                        value={this.state.student.nscc_id}
                                    />
                                </div>

                                {this.getErrors('nscc_id', 'ID')}
                            </div>

                            <div className='field'>
                                <label className='label'>Advisor</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.advisor ? ' is-danger' : '')}
                                        name='advisor'
                                        onChange={this.fieldUpdate}
                                        placeholder='Jane Doe'
                                        type='text'
                                        value={this.state.student.advisor}
                                    />
                                </div>

                                {this.getErrors('advisor', 'Advisor')}
                            </div>
                        </div>

                        <div className='column'>
                            <div className='field'>
                                <label className='label'>First Name</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.first_name ? ' is-danger' : '')}
                                        name='first_name'
                                        onChange={this.fieldUpdate}
                                        placeholder='John'
                                        type='text'
                                        value={this.state.student.first_name}
                                    />
                                </div>

                                {this.getErrors('first_name', 'First Name')}
                            </div>

                            <div className='field'>
                                <label className='label'>Last Name</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.last_name ? ' is-danger' : '')}
                                        name='last_name'
                                        onChange={this.fieldUpdate}
                                        placeholder='Doe'
                                        type='text'
                                        value={this.state.student.last_name}
                                    />
                                </div>

                                {this.getErrors('last_name', 'Last Name')}
                            </div>
                        </div>

                        <div className='column'>
                            <div className='field'>
                                <label className='label'>Start Date</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.start_date ? ' is-danger' : '')}
                                        name='start_date'
                                        onChange={this.fieldUpdate}
                                        type='date'
                                        value={this.state.student.start_date}
                                    />
                                </div>

                                {this.getErrors('start_date', 'Start Date')}
                            </div>

                            <div className='field'>
                                <label className='label'>End Date</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.end_date ? ' is-danger' : '')}
                                        name='end_date'
                                        onChange={this.fieldUpdate}
                                        type='date'
                                        value={this.state.student.end_date}
                                    />
                                </div>

                                {this.getErrors('end_date', 'End Date')}
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
                            <label className='label is-flex' style={{'justifyContent': 'space-between'}}>
                                Currently Active
                                <input checked={this.state.student.active}
                                    name='active'
                                    onChange={this.fieldUpdate}
                                    type='checkbox' />
                            </label>
                        </div>
                    </div>

                    <div className='columns' style={({display: !this.props.add ? 'block' : 'none'})}>
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

                    <ProgressChart edit={true} show={!this.props.add} />
                </form>
            </React.Fragment>
        );
    }
}

StudentForm.propTypes = {
    add: PropTypes.bool.isRequired,
    array: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.object,
    match: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
    setForm: student => dispatch(setForm(student))
});

export default withRouter(connect(null, mapDispatchToProps)(StudentForm));

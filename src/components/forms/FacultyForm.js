import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setForm } from '../../redux/actions/misc';

class FacultyForm extends React.Component {
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
            bottom: '',
            comment: '',
            first_name: '',
            last_name: '',
            nscc_id: ''
        };
        this.faculty = {
            active: true,
            comment: '',
            first_name: '',
            last_name: '',
            nscc_id: ''
        };

        this.state = {
            msg: this.msg,
            faculty: this.faculty
        };
    }

    activateSelected() {
        if (this.edited) { return; }

        let array = this.props.array;
        let params = this.props.match.params;
        let faculty;

        this.cleared = false;
        this.edited = true;

        for (let key of array) {
            if (key.nscc_id === params.id) {
                faculty = key;
            }
        }

        this.setState({
            faculty: faculty,
            msg: this.msg
        }, () => this.props.setForm(this.state.faculty));
    }

    clear() {
        if (this.cleared) { return; }

        this.cleared = true;
        this.edited = false;

        this.setState({faculty: this.faculty}, () => this.props.setForm(this.state.faculty));
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
        let faculty = this.state.faculty;

        if (!this.props.add) { this.activateSelected(); }

        this.setState({
            msg: {
                ...this.state.msg,
                [event.target.name]: '',
                bottom: ''
            },
            faculty: {
                ...faculty,
                [event.target.name]: value
            }
        }, () => this.props.setForm(this.state.faculty));
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
                <h1 className='title'>{(this.props.add ? 'Add' : 'Edit') + ' Faculty'}</h1>

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
                                        placeholder='W0123456'
                                        type='text'
                                        value={this.state.faculty.nscc_id}
                                    />
                                </div>

                                {this.getErrors('nscc_id', 'ID')}
                            </div>
                        </div>

                        <div className='column'>
                            <div className='field'>
                                <label className='label'>First Name</label>
                                <div className='control'>
                                    <input className={'input' + (this.state.msg.first_name ? ' is-danger' : '')}
                                        label='first_name'
                                        name='first_name'
                                        onChange={this.fieldUpdate}
                                        placeholder='John'
                                        type='text'
                                        value={this.state.faculty.first_name}
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
                                        value={this.state.faculty.last_name}
                                    />
                                </div>

                                {this.getErrors('last_name', 'Last Name')}
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
                                    value={this.state.faculty.comment} />
                            </div>
                        </div>
                    </div>

                    <div className='columns'>
                        <div className='column'>
                            <label className='label is-flex' style={{'justifyContent': 'space-between'}}>
                                Currently Active

                                <input checked={this.state.faculty.active}
                                    name='active'
                                    onChange={this.fieldUpdate}
                                    type='checkbox'
                                />
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
                </form>
            </React.Fragment>
        );
    }
}

FacultyForm.propTypes = {
    add: PropTypes.bool.isRequired,
    array: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.object,
    setForm: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
    setForm: faculty => dispatch(setForm(faculty))
});

export default withRouter(connect(null, mapDispatchToProps)(FacultyForm));

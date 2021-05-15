import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Tabs from '../tabs/Tabs';
import Users from '../lists/Users';
import Courses from '../lists/Courses';
import StudentForm from '../forms/StudentForm';
import CourseForm from '../forms/CourseForm';
import Info from '../info/Info';

import {
    saveItem,
    deleteItem,
    fetch,
    setConfirmDelete,
    showConfirmDelete,
    setLoading
} from '../../redux/actions/misc';

import {
    logout
} from '../../redux/actions/authActions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.checkShowForm = this.checkShowForm.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.fetch = this.fetch.bind(this);
        this.itemExists = this.itemExists.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            add: false,
            array: [],
            errors: null,
            filter: 'all',
            lists: true,
            content: true
        };
    }

    checkShowForm() {
        let params = this.props.match.params;

        if (!params.edit) {
            if (this.state.add) { return true; }
            return false;
        }

        return true;
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                lists: true,
                content: true
            });
        }, false);

        this.fetch();
    }

    componentDidUpdate(prevProps) {
        let newId = prevProps.match.params.id !== this.props.match.params.id;

        if (newId) {
            this.props.setConfirmDelete(false);
            this.props.showConfirmDelete(false);
        }
    }

    deleteItem() {
        if (!this.props.show_confirm_del) {
            this.props.setConfirmDelete(false);
            this.props.showConfirmDelete(true);

            return;
        }

        if (!this.props.confirm_del) { return; }

        this.props.setConfirmDelete(false);
        this.props.showConfirmDelete(false);

        let params = this.props.match.params;
        let url = `${this.props.api_url}/${params.type}/delete`;

        this.props.deleteItem(url, params, () => this.fetch(), error => {
            localStorage.removeItem('token');

            if (error.response.status === 401) {
                localStorage.setItem('msg', error.response.data.text);
                this.props.history.push('/');

                return;
            }

            localStorage.setItem('token', error.response.headers.token);
        });
    }

    fetch() {
        let params = this.props.match.params;

        this.props.fetch(this.props.api_url, params, array => {
            this.setState({array: array}, () => {
                if (!array || !array[0]) {
                    this.setState({
                        add: true
                    });

                    this.props.history.push(`/dashboard/${params.type}`);
                    return;
                }

                if (!params.id || !this.itemExists()) {
                    let itemId = array[0].nscc_id ? array[0].nscc_id : array[0].course_code;
                    let route = `/dashboard/${params.type}/${itemId}`;

                    this.props.history.push(route);
                }
            });
        }, error => {
            localStorage.removeItem('token');

            if (error.response.status === 401) {
                localStorage.setItem('msg', error.response.data.text);
                this.props.history.push('/');

                return;
            }

            localStorage.setItem('token', error.response.headers.token);
        });
    }

    itemExists() {
        let exists = false;
        let params = this.props.match.params;

        for (let key of this.state.array) {
            let thisId = key.nscc_id ? key.nscc_id : key.course_code;

            if (params.id && (thisId === params.id)) {
                exists = true;
                break;
            } else if (!params.id) { break; }
        }

        return exists;
    }

    save() {
        let action = this.state.add ? 'add' : 'update';
        let params = this.props.match.params;
        let url = `${this.props.api_url}/${params.type}/${action}`;

        this.props.saveItem(url, this.props.form_state, () => {
            this.setState({add: false}, () => {
                let formState = this.props.form_state;
                let thisId = formState.nscc_id ? formState.nscc_id : formState.course_code;
                thisId = thisId.toUpperCase();

                this.props.history.push(`/dashboard/${params.type}/${thisId}`);
                this.fetch();
            });
        }, error => {
            let msgBlock = {};

            localStorage.removeItem('token');

            if (error.response.status === 401) {
                localStorage.setItem('msg', error.response.data.text);
                this.props.history.push('/');

                return;
            }

            localStorage.setItem('token', error.response.headers.token);

            // build error msg object
            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            if (error.response.data.text) { msgBlock.bottom = error.response.data.text; }

            this.setState({errors: msgBlock});
        });
    }

    render() {
        if (!this.props.token) { return <Redirect to='/' />; }

        let params = this.props.match.params;
        let tabs = this.props.tabs.panel_array;
        let panel_tab = params.edit === 'edit' ? tabs[1] : tabs[0];
        let showLists = (this.state.add && this.state.array.length > 0) ? false : this.state.lists ? true : false;

        let contentColumns = (this.state.add && this.state.array.length > 0) ? 'is-12' : 'is-8-desktop is-9-widescreen is-10-fullhd';
        let listColumns = (this.state.add && this.state.array.length > 0) ? 'is-hidden' : 'is-4-desktop is-3-widescreen is-2-fullhd';

        return (
            <div className='card-content has-text-centered is-paddingless'>
                <div className='columns is-desktop is-marginless'>
                    <div className={'card column ' + listColumns + ' is-paddingless has-background-light'}>
                        <div className='card-header columns is-marginless is-hidden-desktop'>
                            <div className='column is-12 is-paddingless'>
                                <a className='card-header-icon has-background-white'
                                    onClick={() => this.setState({lists: !this.state.lists})}>
                                    <span className='icon'>
                                        <i className={`fas fa-chevron-${showLists ? 'down' : 'right'}`} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div style={{overflow: 'hidden', height: showLists ? 'auto' : '0'}}>
                            <div className='card-header tabs is-marginless'>
                                <ul style={{display: 'flex'}}>
                                    <Tabs active={params.type}
                                        array={this.props.tabs.list_array} />
                                </ul>
                            </div>

                            <div className='card-content section'>
                                <div className='field select'
                                    style={{display: params.type === 'course' ? 'none' : 'inline-block'}}>
                                    <select onChange={evt => this.setState({filter: evt.target.value})}>
                                        <option value='all'>All</option>
                                        <option value='active'>Active</option>
                                        <option value='inactive'>Inactive</option>
                                    </select>
                                </div>

                                <div className='field'>
                                    <a className='button level-item is-success'
                                        onClick={() => this.setState({add: true}, () => {
                                            this.props.setConfirmDelete(false);
                                            this.props.showConfirmDelete(false);
                                        })}>
                                        Add
                                    </a>
                                </div>

                                <Users current={params.id}
                                    editing={params.edit ? true : false}
                                    filter={this.state.filter}
                                    show={params.type === 'student'}
                                    users={this.state.array} />

                                <Courses courses={this.state.array}
                                    current={params.id}
                                    editing={params.edit ? true : false}
                                    show={params.type === 'course'} />
                            </div>
                        </div>
                    </div>

                    <div className={'card column ' + contentColumns + ' is-paddingless has-background-light'}>
                        <div className='card-header columns is-marginless is-hidden-desktop'>
                            <div className='column is-12 is-paddingless'>
                                <a className='card-header-icon has-background-white'
                                    onClick={() => this.setState({content: !this.state.content})}>
                                    <span className='icon'>
                                        <i className={`fas fa-chevron-${this.state.content ? 'down' : 'right'}`} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div style={{overflow: 'hidden', height: this.state.content ? 'auto' : '0'}}>
                            <div className='card-header tabs is-marginless'>
                                <ul style={{display: 'flex'}}>
                                    <Tabs active={this.state.add ? 'Add' : panel_tab}
                                        array={this.state.add ? ['Add'] : this.props.tabs.panel_array}
                                        itemId={params.id}
                                        type={params.type} />
                                </ul>
                            </div>

                            <div className='card-content has-text-left section'>
                                <Info show={!this.checkShowForm()} type={params.type} />

                                <StudentForm add={this.state.add}
                                    array={this.state.array}
                                    errors={this.state.errors}
                                    show={this.checkShowForm() && params.type === 'student'} />
                                <CourseForm add={this.state.add}
                                    array={this.state.array}
                                    errors={this.state.errors}
                                    show={this.checkShowForm() && params.type === 'course'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card columns is-desktop is-marginless'>
                    {/* desktop logout */}
                    <div className='card-footer-item column is-4-desktop is-3-widescreen is-2-fullhd is-centered is-hidden-touch section'>
                        <a className='button is-link is-fullwidth' onClick={() => this.props.logout()}>Logout</a>
                    </div>

                    <div className='card-footer-item column is-8-desktop is-9-widescreen is-10-fullhd section'
                        style={{display: (this.state.add || (params.edit === 'edit')) ? 'block' : 'none'}}>
                        <div className='columns is-desktop is-centered'>
                            <div className='column is-4-desktop'
                                style={{display: this.state.add ? 'block' : 'none'}}>
                                <a className='button is-info is-fullwidth'
                                    disabled={this.props.loading}
                                    onClick={() => {
                                        if (this.state.array.length > 0) { this.setState({add: false}); }
                                    }}>
                                    Cancel
                                </a>
                            </div>

                            <div className='column is-4-desktop'
                                style={{display: this.state.add ? 'none' : 'block'}}>
                                <a className='button is-danger is-fullwidth'
                                    disabled={this.props.loading || this.state.add}
                                    onClick={() => this.deleteItem()}>
                                    Delete {params.type === 'course' ? 'Course' : 'User'}
                                </a>

                                <label className='column confirm-delete has-background-light has-text-danger label'
                                    style={{display: this.props.show_confirm_del ? 'block' : 'none'}}>
                                    Confirm Deletion<br />

                                    <input checked={this.props.confirm_del}
                                        onChange={() => this.props.setConfirmDelete(!this.props.confirm_del)}
                                        type='checkbox' />
                                </label>
                            </div>

                            <div className='column is-4-desktop'>
                                <a className='button is-success is-fullwidth'
                                    disabled={this.props.loading}
                                    onClick={() => this.save()}>
                                    Save {params.type === 'course' ? 'Course' : 'User'}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* mobile logout */}
                    <div className='is-hidden-desktop section card-footer-item column'>
                        <a className='button is-link is-fullwidth'
                            disabled={this.props.loading}
                            onClick={() => this.props.logout()}>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    saveItem: PropTypes.func.isRequired,
    api_url: PropTypes.string.isRequired,
    confirm_del: PropTypes.bool.isRequired,
    deleteItem: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    form_state: PropTypes.object,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    setConfirmDelete: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    showConfirmDelete: PropTypes.func.isRequired,
    show_confirm_del: PropTypes.bool.isRequired,
    tabs: PropTypes.object.isRequired,
    // Auth
    logout: PropTypes.func.isRequired,
    token: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
    saveItem: (url, params, successCb, errorCb) => dispatch(saveItem(url, params, successCb, errorCb)),
    deleteItem: (url, params, successCb, errorCb) => dispatch(deleteItem(url, params, successCb, errorCb)),
    fetch: (url, params, successCb, errorCb) => dispatch(fetch(url, params, successCb, errorCb)),
    setConfirmDelete: status => dispatch(setConfirmDelete(status)),
    setLoading: status => dispatch(setLoading(status)),
    showConfirmDelete: status => dispatch(showConfirmDelete(status)),
    // Auth
    logout: () => dispatch(logout())
});

const mapStateToProps = state => ({
    api_url: state.misc.api_url,
    confirm_del: state.misc.confirm_del,
    form_state: state.misc.form_state,
    loading: state.misc.loading,
    show_confirm_del: state.misc.show_confirm_del,
    tabs: state.misc.tabs,
    // Auth
    token: state.auth.token
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

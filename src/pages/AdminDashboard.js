import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Users from '../components/lists/Users';
import Courses from '../components/lists/Courses';
import Info from '../components/info/Info';

import {
    fetch,
    setConfirmDelete,
    showConfirmDelete,
    setLoading
} from '../redux/actions/misc';

import {
    logout
} from '../redux/actions/authActions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);
        this.itemExists = this.itemExists.bind(this);

        this.state = {
            add: false,
            array: [],
            errors: null,
            filter: 'all',
            lists: true,
            content: true
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                lists: true,
                content: true
            });
        }, false);

        this.fetch();

        // Redux action to fetch all students and courses
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

    render() {
        if (!this.props.token) { return <Redirect to='/' />; }

        let params = this.props.match.params;
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
                                    <li className={params.type === 'student' ? 'is-active' : ''}>
                                        <a className='is-size-7' href='/dashboard/student'>
                                            {'Students'}
                                        </a>
                                    </li>

                                    <li className={params.type === 'course' ? 'is-active' : ''}>
                                        <a className='is-size-7' href='/dashboard/course'>
                                            {'Courses'}
                                        </a>
                                    </li>
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
                                    <li className='is-active'>
                                        <a className='is-size-7' href='/dashboard/student'>
                                            {'Students'}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className='card-content has-text-left section'>
                                <Info show={true} type={params.type} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card columns is-desktop is-marginless'>

                    {/* Desktop logout button */}
                    <div className='card-footer-item column is-4-desktop is-3-widescreen is-2-fullhd is-centered is-hidden-touch section'>
                        <a className='button is-link is-fullwidth' onClick={() => this.props.logout()}>Logout</a>
                    </div>

                    {/* Mobile logout button */}
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
    api_url: PropTypes.string.isRequired,
    confirm_del: PropTypes.bool.isRequired,
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

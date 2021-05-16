import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import StudentList from '../components/StudentList';
import CourseList from '../components/CourseList';

import StudentInformation from '../components/StudentInformation';
import CourseInformation from '../components/CourseInformation';

import EditStudent from '../components/EditStudent';
import EditCourse from '../components/EditCourse';

// Auth actions
import {
    logout
} from '../redux/actions/authActions';

// Student actions
import {
    fetchAllStudents
} from '../redux/actions/studentActions';

// Course actions
import {
    fetchAllCourses
} from '../redux/actions/courseActions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.itemExists = this.itemExists.bind(this);

        this.type = 'student';

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

        // Split pathname to get type from route
        // 0 = '''
        // 1 = 'admin'
        // 2 = 'student' or 'course'
        this.type = this.props.location.pathname.split('/')[2].toLowerCase();

        // Redux actions to fetch all students and courses
        if (this.type === 'student') {
            this.props.fetchAllStudents(this.props.match.params.id);
        }

        if (this.type === 'course') {
            this.props.fetchAllCourses(this.props.match.params.id);
        }
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
        // Auth check
        if (!this.props.token) { return <Redirect to='/' />; }

        let params = this.props.match.params;
        let pathname = this.props.location.pathname.split('/');
        let isEditing = false;

        if ((pathname[4]) && (pathname[4].toLowerCase() === 'edit')) {
            isEditing = true;
        }

        let contentColumns = 'is-8-desktop is-9-widescreen is-10-fullhd';
        let listColumns = 'is-4-desktop is-3-widescreen is-2-fullhd';

        return (
            <div className='card-content has-text-centered is-paddingless'>
                <div className='columns is-desktop is-marginless'>
                    <div className={'card column ' + listColumns + ' is-paddingless has-background-light'}>

                        {/* Collapse button for student/course lists */}
                        <div className='card-header columns is-marginless is-hidden-desktop'>
                            <div className='column is-12 is-paddingless'>
                                <a className='card-header-icon has-background-white'
                                    onClick={() => this.setState({lists: !this.state.lists})}>
                                    <span className='icon'>
                                        <i className={`fas fa-chevron-${this.state.lists ? 'down' : 'right'}`} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Student/course lists */}
                        <div style={{overflow: 'hidden', height: this.state.lists ? 'auto' : '0'}}>
                            <div className='card-header tabs is-marginless'>

                                {/* Control tabs for list components */}
                                <ul style={{display: 'flex'}}>
                                    <li className={this.type === 'student' ? 'is-active' : ''}>
                                        <a className='is-size-7' href='/admin/student'>
                                            {'Students'}
                                        </a>
                                    </li>

                                    <li className={this.type === 'course' ? 'is-active' : ''}>
                                        <a className='is-size-7' href='/admin/course'>
                                            {'Courses'}
                                        </a>
                                    </li>
                                </ul>

                            </div>

                            {/* List components */}
                            <div className='card-content section'>
                                <div className='field select'
                                    style={{display: this.type === 'course' ? 'none' : 'inline-block'}}>
                                    <select onChange={evt => this.setState({filter: evt.target.value})}>
                                        <option value='all'>All</option>
                                        <option value='active'>Active</option>
                                        <option value='inactive'>Inactive</option>
                                    </select>
                                </div>

                                <StudentList
                                    currentListItem={params.id}
                                    isEditing={isEditing}
                                    list={this.props.student.list}
                                    listFilter={this.state.filter}
                                    visible={this.type === 'student'}
                                />

                                <CourseList
                                    currentListItem={params.id}
                                    isEditing={isEditing}
                                    list={this.props.course.list}
                                    listFilter={this.state.filter}
                                    visible={this.type === 'course'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={'card column ' + contentColumns + ' is-paddingless has-background-light'}>

                        {/* Collapse button for information component */}
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

                        {/* Information component */}
                        <div style={{overflow: 'hidden', height: this.state.content ? 'auto' : '0'}}>
                            {/* Control tabs for information components */}
                            <div className='card-header tabs is-marginless'>
                                <ul style={{display: 'flex'}}>
                                    <li className={isEditing ? '' : 'is-active'}>
                                        <a className='is-size-7' href={`/admin/${this.type}/${params.id}`}>
                                            {'Info'}
                                        </a>
                                    </li>

                                    <li className={isEditing ? 'is-active' : ''}>
                                        <a
                                            className='is-size-7'
                                            href={params.id ? `/admin/${this.type}/${params.id}/edit` : ''}
                                        >
                                            {'Edit'}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className='card-content has-text-left section'>
                                {this.type === 'student' ? <StudentInformation visible={!isEditing} /> : <CourseInformation visible={!isEditing} />}

                                {this.type === 'student' ? <EditStudent visible={isEditing} /> : <EditCourse visible={isEditing} />}
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
    form_state: PropTypes.object,
    tabs: PropTypes.object.isRequired,
    location: PropTypes.object,
    // API
    loading: PropTypes.bool.isRequired,
    // Auth
    logout: PropTypes.func.isRequired,
    token: PropTypes.string,
    // Students
    fetchAllStudents: PropTypes.func.isRequired,
    student: PropTypes.object,
    // Courses
    course: PropTypes.object,
    fetchAllCourses: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    logout: () => dispatch(logout()),
    // Student actions
    fetchAllStudents: nscc_id => dispatch(fetchAllStudents(nscc_id)),
    // Course actions
    fetchAllCourses: course_code => dispatch(fetchAllCourses(course_code))
});

const mapStateToProps = state => ({
    form_state: state.misc.form_state,
    tabs: state.misc.tabs,
    // API reducer
    loading: state.api.isLoading,
    // Auth reducer
    token: state.auth.token,
    // Student reducer
    student: state.student,
    // Course reducer
    course: state.course
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

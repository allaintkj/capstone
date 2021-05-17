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

// Student actions
import {
    fetchAllStudents
} from '../redux/actions/studentActions';

// Course actions
import {
    fetchAllCourses
} from '../redux/actions/courseActions';

// Auth actions
import {
    logout
} from '../redux/actions/authActions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.type = 'student';

        this.state = {
            filter: 'all',
            collapseLists: false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                collapseLists: false
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

    render() {
        // Auth check
        if (!this.props.token) { return <Redirect to='/' />; }

        let params = this.props.match.params;
        let pathname = this.props.location.pathname.split('/');
        let isEditing = false;

        if ((pathname[4]) && (pathname[4].toLowerCase() === 'edit')) { isEditing = true; }

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
                                    onClick={() => this.setState({collapseLists: !this.state.collapseLists})}>
                                    <span className='icon'>
                                        <i className={`fas fa-chevron-${this.state.collapseLists ? 'right' : 'down'}`} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Student/course lists */}
                        <div className={this.state.collapseLists ? 'is-hidden' : 'is-block'}>
                            <div className='card-header tabs is-marginless'>

                                {/* Control tabs for list components */}
                                <ul style={{display: 'flex'}}>
                                    <li className={this.type === 'student' ? 'is-active' : ''}>
                                        <a href='/admin/student'>
                                            {'Students'}
                                        </a>
                                    </li>

                                    <li className={this.type === 'course' ? 'is-active' : ''}>
                                        <a href='/admin/course'>
                                            {'Courses'}
                                        </a>
                                    </li>
                                </ul>

                            </div>

                            {/* List components */}
                            <div className='card-content section'>
                                <div className='columns'>
                                    <div className='column'>
                                        <a className='button is-success is-block'
                                            disabled={false}
                                            href={`/admin/${this.type}/add`}>

                                            {'Add New'}

                                        </a>
                                    </div>
                                </div>

                                <div className={`field select is-small ${this.type === 'course' ? 'is-hidden' : ''}`}>
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

                    <div className={'card column ' + contentColumns + ' has-background-light p-0'}>

                        {/* Information/form component */}
                        <div style={{overflow: 'hidden', height: 'auto'}}>

                            {/* Control tabs for information/form components */}
                            <div className='card-header tabs is-marginless'>
                                <ul style={{display: 'flex'}}>

                                    <li className={isEditing ? '' : 'is-active'}>
                                        <a href={`/admin/${this.type}/${params.id}`}>
                                            {'Info'}
                                        </a>
                                    </li>

                                    <li className={isEditing ? 'is-active' : ''}>
                                        <a href={params.id ? `/admin/${this.type}/${params.id}/edit` : ''}>
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
            </div>
        );
    }
}

Dashboard.propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
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

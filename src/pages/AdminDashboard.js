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

/*
*   AdminDashboard page
*/
class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);

        // Default to student dashboard
        this.type = 'student';

        // Construct state
        this.state = {
            filter: 'all',
            collapseLists: false
        };
    }

    componentDidMount() {
        // Expand list component on window resize
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

        // If user is editing, element #5 in pathname array will be 'edit'
        // []/[admin]/[student]/[:id]/[edit]
        if ((pathname[4]) && (pathname[4].toLowerCase() === 'edit')) { isEditing = true; }

        return (
            <div className='section has-background-light pt-3'>
                <div className='container'>
                    <div className='columns'>
                        <div className='column is-12 is-4-desktop'>
                            {/* Student/course lists */}
                            <div className='tabs'>
                                {/* Control tabs for list components */}
                                <ul className='is-block'>
                                    <li className={`is-inline-block ${this.type === 'student' ? 'is-active' : ''}`}>
                                        <a href='/admin/student'>
                                            {'Students'}
                                        </a>
                                    </li>

                                    <li className={`is-inline-block ${this.type === 'course' ? 'is-active' : ''}`}>
                                        <a href='/admin/course'>
                                            {'Courses'}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* List components */}
                            <a className='button is-success is-block mb-3'
                                disabled={false}
                                href={`/admin/${this.type}/add`}>
                                {'Add New'}
                            </a>

                            <div className={`has-text-centered mb-3 ${this.type === 'course' ? 'is-hidden' : ''}`}>
                                <div className='field select is-small'>
                                    <select onChange={evt => this.setState({filter: evt.target.value})}>
                                        <option value='all'>All</option>
                                        <option value='active'>Active</option>
                                        <option value='inactive'>Inactive</option>
                                    </select>
                                </div>
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

                        <div className='column is-12 is-8-desktop'>
                            {/* Control tabs for information/form components */}
                            <div className='tabs'>
                                <ul className='is-block'>
                                    <li className={`is-inline-block ${isEditing ? '' : 'is-active'}`}>
                                        <a href={`/admin/${this.type}/${params.id ? params.id : ''}`}>
                                            {'Info'}
                                        </a>
                                    </li>

                                    <li className={`is-inline-block ${isEditing ? 'is-active' : ''}`}>
                                        <a href={params.id ? `/admin/${this.type}/${params.id}/edit` : ''}>
                                            {'Edit'}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {this.type === 'student' ? <StudentInformation visible={!isEditing} /> : <CourseInformation visible={!isEditing} />}

                            {this.type === 'student' ? <EditStudent visible={isEditing} /> : <EditCourse visible={isEditing} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AdminDashboard.propTypes = {
    // Router
    location: PropTypes.object,
    match: PropTypes.object,
    // Auth
    token: PropTypes.string,
    // Students
    fetchAllStudents: PropTypes.func.isRequired,
    student: PropTypes.object,
    // Courses
    course: PropTypes.object,
    fetchAllCourses: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Student actions
    fetchAllStudents: nscc_id => dispatch(fetchAllStudents(nscc_id)),
    // Course actions
    fetchAllCourses: course_code => dispatch(fetchAllCourses(course_code))
});

const mapStateToProps = state => ({
    // Auth reducer
    token: state.auth.token,
    // Student reducer
    student: state.student,
    // Course reducer
    course: state.course
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);

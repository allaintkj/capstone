import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Course actions
import {
    setNewCourse
} from '../redux/actions/courseActions';

/*
*   CourseList component displayed in left/upper panel
*/
class CourseList extends React.Component {
    render() {
        if (!this.props.visible) { return null; }

        return (
            <ul className='buttons is-block' style={{maxHeight: '400px'}}>
                {this.props.list.map((course, index) => {
                    let className = `button is-block mx-0 ${this.props.currentListItem === course.course_code ? ' is-dark' : ''}`;
                    let courseName = `${course.course_code}  ${course.course_name}`;
                    let route = `/admin/course/${course.course_code}`;
                    route += this.props.isEditing ? '/edit' : '';

                    if (course.course_name.length > 15) {
                        courseName = courseName.substr(0, 25) + '...';
                    }

                    return (
                        <li className={className + ' is-small'}
                            key={`courses-list-${index}`}
                            onClick={() => {
                                this.props.setNewCourse(course.course_code);
                                this.props.history.push(route);
                            }}
                            title={`${course.course_code} ${course.course_name}`}>
                            {courseName}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

CourseList.propTypes = {
    currentListItem: PropTypes.string,
    isEditing: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    listFilter: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    // Router
    history: PropTypes.object.isRequired,
    // Courses
    setNewCourse: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Course actions
    setNewCourse: course_code => dispatch(setNewCourse(course_code))
});

export default withRouter(connect(null, mapDispatchToProps)(CourseList));

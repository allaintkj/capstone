import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Student actions
import {
    setNewCourse
} from '../redux/actions/courseActions';

class CourseList extends React.Component {
    render() {
        if (!this.props.visible) { return null; }

        return (
            <ul className='buttons' style={{maxHeight: '400px', overflow: 'auto', marginBottom: '2rem'}}>
                {this.props.list.map((course, index) => {
                    let className = `button is-fullwidth ${this.props.currentListItem === course.course_code ? ' is-dark' : ''}`;
                    let courseName = `${course.course_code}  ${course.course_name}`;
                    let route = `/dashboard/course/${course.course_code}`;

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
    history: PropTypes.object.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    listFilter: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    // Courses
    setNewCourse: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Course actions
    setNewCourse: course_code => dispatch(setNewCourse(course_code))
});

export default withRouter(connect(null, mapDispatchToProps)(CourseList));

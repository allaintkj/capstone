import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Student actions
import {
    setNewStudent
} from '../redux/actions/studentActions';

class StudentList extends React.Component {
    render() {
        if (!this.props.visible) { return null; }

        return (
            <ul className='buttons' style={{maxHeight: '400px', overflow: 'auto', marginBottom: '2rem'}}>
                {this.props.list.map((student, index) => {
                    let className = 'button is-fullwidth' + (this.props.currentListItem === student.nscc_id ? ' is-dark' : '');
                    let userName = student.last_name ? student.last_name + ', ' + student.first_name : student.first_name;
                    let route = `/admin/student/${student.nscc_id}`;
                    route += this.props.isEditing ? '/edit' : '';

                    if (this.props.listFilter === 'active' && !student.active) {
                        return null;
                    } else if (this.props.listFilter === 'inactive' && student.active) {
                        return null;
                    }

                    return (
                        <li className={className + ' is-small'}
                            key={`users-list-${index}`}
                            onClick={() => {
                                this.props.setNewStudent(student.nscc_id);
                                this.props.history.push(route);
                            }}>
                            {userName}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

StudentList.propTypes = {
    currentListItem: PropTypes.string,
    history: PropTypes.object.isRequired,
    isEditing: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    listFilter: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    // Students
    setNewStudent: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Student actions
    setNewStudent: nscc_id => dispatch(setNewStudent(nscc_id))
});

export default withRouter(connect(null, mapDispatchToProps)(StudentList));

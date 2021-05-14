import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

class Courses extends React.Component {
    render() {
        if (!this.props.show) { return null; }

        let params = this.props.match.params;

        return (
            <ul className='buttons' style={{maxHeight: '400px', overflow: 'auto', marginBottom: '2rem'}}>
                {this.props.courses.map((item, index) => {
                    let className = `button is-fullwidth ${this.props.current === item.course_code ? ' is-dark' : ''}`;
                    let itemName = `${item.course_code}  ${item.course_name}`;
                    let route = `/dashboard/${params.type}/${item.course_code}`;
                    route += this.props.editing ? '/edit' : '';

                    if (item.course_name.length > 15) {
                        itemName = itemName.substr(0, 25) + '...';
                    }

                    return (
                        <li className={className + ' is-small'}
                            key={`courses-list-${index}`}
                            onClick={() => this.props.history.push(route)}
                            title={`${item.course_code} ${item.course_name}`}>
                            {itemName}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

Courses.propTypes = {
    courses: PropTypes.arrayOf(PropTypes.object).isRequired,
    current: PropTypes.string,
    editing: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
};

export default withRouter(Courses);

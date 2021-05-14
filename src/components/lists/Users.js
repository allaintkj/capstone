import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

class Users extends React.Component {
    render() {
        if (!this.props.show) { return null; }

        let params = this.props.match.params;

        return (
            <ul className='buttons' style={{maxHeight: '400px', overflow: 'auto', marginBottom: '2rem'}}>
                {this.props.users.map((user, index) => {
                    let className = 'button is-fullwidth' + (this.props.current === user.nscc_id ? ' is-dark' : '');
                    let userName = `${user.last_name ? user.last_name + ', ' + user.first_name : user.first_name}`;
                    let route = `/dashboard/${params.type}/${user.nscc_id}`;
                    route += this.props.editing ? '/edit' : '';

                    if (this.props.filter === 'active' && !user.active) {
                        return null;
                    } else if (this.props.filter === 'inactive' && user.active) {
                        return null;
                    }

                    return (
                        <li className={className + ' is-small'}
                            key={`users-list-${index}`}
                            onClick={() => this.props.history.push(route)}>
                            {userName}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

Users.propTypes = {
    current: PropTypes.string,
    editing: PropTypes.bool.isRequired,
    filter: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withRouter(Users);

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

// Auth actions
import {
    logout
} from '../redux/actions/authActions';

class LogoutButton extends React.Component {
    render() {
        return (
            <div className='columns mt-6'>
                <div className='column'>
                    <a className='button is-link is-block'
                        disabled={false}
                        onClick={() => { this.props.logout(); }}>

                        Logout

                    </a>
                </div>
            </div>
        );
    }
}

LogoutButton.propTypes = {
    // Auth
    logout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    // Auth actions
    logout: () => dispatch(logout())
});

export default connect(null, mapDispatchToProps)(LogoutButton);

import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.title = 'NSCC ALP Student Progress Tracker';
        this.subtitle = '';
    }

    render() {
        if (!this.props.show) { return null; }
        return (
            <div className='section card-header has-background-link column'>
                <h1 className='title has-text-white'>{this.title}</h1>
                <h2 className='subtitle has-text-white'>{this.subtitle}</h2>
            </div>
        );
    }
}

Header.propTypes = {
    show: PropTypes.bool.isRequired
};

export default Header;

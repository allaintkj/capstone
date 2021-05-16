import React from 'react';
import PropTypes from 'prop-types';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) { return null; }

        return (
            <div className='card-footer has-background-grey-lighter section'>
                <div className='has-text-centered' style={{margin: 'auto'}}>
                    <p>Designed with <a href='https://bulma.io' rel='noopener noreferrer' target='_blank'>Bulma</a></p>
                    <br />
                    <p>
                        Powered by
                        <a href='https://reactjs.org' rel='noopener noreferrer' target='_blank'> React</a>,
                        <a href='https://nodejs.org/' rel='noopener noreferrer' target='_blank'> Node.js</a>, and
                        <a href='https://www.mysql.com/' rel='noopener noreferrer' target='_blank'> MySQL</a>
                    </p>
                </div>
            </div>
        );
    }
}

Footer.propTypes = {
    show: PropTypes.bool.isRequired
};

export default Footer;

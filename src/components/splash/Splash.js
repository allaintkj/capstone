import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class Splash extends React.Component {
    constructor() {
        super();

        this.getMsg = this.getMsg.bind(this);
    }

    getMsg() {
        let msg = 'Student and faculty login';
        let storedMsg = localStorage.getItem('msg');

        if (storedMsg) {
            localStorage.removeItem('msg');
            msg = <span className='has-text-danger'>{storedMsg}</span>;
        }

        return msg;
    }

    render() {
        // auth check
        if (localStorage.getItem('token')) { return <Redirect to='/dashboard/student' />; }

        return (
            <React.Fragment>
                <div className='card-content has-text-centered'>
                    <div className='section'>
                        <h2 className='subtitle'>{this.getMsg()}</h2>
                        <h2 className='subtitle'>Please click one of the buttons below to sign in</h2>
                    </div>

                    <div className='section buttons is-centered'>
                        <Link className='button is-link inline' to={{pathname: '/login/student'}}>
                            Student
                        </Link>

                        <Link className='button is-info inline' to={{pathname: '/login/faculty'}}>
                            Faculty
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Splash;

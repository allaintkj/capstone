import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import Header from '../header/Header';
import Footer from '../footer/Footer';
import Splash from '../splash/Splash';
import LoginForm from '../forms/LoginForm';
import PasswordReset from '../forms/PasswordReset';
import Dashboard from '../dashboard/Dashboard';
import Info from '../info/Info';

import store from '../../redux/store';

class AppRoutes extends React.Component {
    constructor(props) {
        super(props);

        this.wrapInfo = this.wrapInfo.bind(this);
        this.showLogoutButton = this.showLogoutButton.bind(this);
    }

    showLogoutButton() {
        return (
            <div className='section has-text-centered'>
                <a className='button is-link' onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.setItem('msg', 'You have been logged out');
                    this.props.history.push('/');
                }}>
                    Logout
                </a>
            </div>
        );
    }

    wrapInfo() {
        return (
            <React.Fragment>
                <div className='section'>
                    <Info show={true} type={'student'} />

                    {this.showLogoutButton()}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <Header show={true} />

                    <Switch>
                        <Route component={this.wrapInfo} exact path='/student/:id' />

                        {/*

                            FIXME
                            Better routing
                            This way there's no string comparisons to route params:

                        */}

                        {/*

                        <Route component={this.wrapInfo} exact path='/student/:id' />

                        <Route component={Dashboard} path='/dashboard/student/:id/edit' />
                        <Route component={Dashboard} path='/dashboard/student/:id' />
                        <Route component={Dashboard} path='/dashboard/student' />

                        <Route component={Dashboard} path='/dashboard/faculty/:id/edit' />
                        <Route component={Dashboard} path='/dashboard/faculty/:id' />
                        <Route component={Dashboard} path='/dashboard/faculty' />

                        <Route component={PasswordReset} path='/password' />

                        <Route component={LoginForm} path='/login/faculty' />
                        <Route component={LoginForm} path='/login/student' />
                        
                        <Route component={Splash} path='/' />

                        <Route component={ErrorPage} />

                        */}
                        
                        <Route component={Dashboard} path='/dashboard/:type/:id/:edit' />
                        <Route component={Dashboard} path='/dashboard/:type/:id' />
                        <Route component={Dashboard} path='/dashboard/:type' />

                        <Route component={PasswordReset} path='/password' />

                        <Route component={LoginForm} path='/login/:type' />
                        <Route component={LoginForm} path='/login' />

                        <Route component={Splash} path='/' />
                    </Switch>

                    <Footer show={true}/>
                </React.Fragment>
            </Provider>
        );
    }
}

AppRoutes.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object

};

export default withRouter(AppRoutes);

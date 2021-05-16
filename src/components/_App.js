import React from 'react';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

import LoginForm from '../pages/LoginForm';
import PasswordReset from '../pages/PasswordReset';
import StudentHome from '../pages/StudentHome';
import AdminDashboard from '../pages/AdminDashboard';

import store from '../redux/store';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <Header show={true} />

                    <Switch>
                        <Route component={StudentHome} exact path='/student/:id' />

                        <Route component={AdminDashboard} path='/admin/student/:id/edit' />
                        <Route component={AdminDashboard} path='/admin/student/:id' />
                        <Route component={AdminDashboard} path='/admin/student' />

                        <Route component={AdminDashboard} path='/admin/course/:id/edit' />
                        <Route component={AdminDashboard} path='/admin/course/:id' />
                        <Route component={AdminDashboard} path='/admin/course' />

                        <Route component={PasswordReset} path='/password' />

                        <Route component={LoginForm} path='/login' />
                        <Route exact path='/'><Redirect from='/' to='/login' /></Route>
                    </Switch>

                    <Footer show={true}/>
                </React.Fragment>
            </Provider>
        );
    }
}

export default App;

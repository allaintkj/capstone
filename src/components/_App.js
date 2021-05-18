import React from 'react';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import AddStudent from '../pages/AddStudent';
import AddCourse from '../pages/AddCourse';
import AdminDashboard from '../pages/AdminDashboard';
import LoginForm from '../pages/LoginForm';
import PasswordReset from '../pages/PasswordReset';
import StudentHome from '../pages/StudentHome';

import store from '../redux/store';

/*
*   Root component
*/
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <div className='section card-header has-background-link column'>
                        <h1 className='title has-text-white'>NSCC ALP Student Progress Tracker</h1>
                    </div>

                    <Switch>
                        <Route component={StudentHome} exact path='/student/:id' />

                        <Route component={AddStudent} path='/admin/student/add' />
                        <Route component={AddCourse} path='/admin/course/add' />

                        <Route component={AdminDashboard} path='/admin/student/:id/edit' />
                        <Route component={AdminDashboard} path='/admin/student/:id' />
                        <Route component={AdminDashboard} path='/admin/student' />

                        <Route component={AdminDashboard} path='/admin/course/:id/edit' />
                        <Route component={AdminDashboard} path='/admin/course/:id' />
                        <Route component={AdminDashboard} path='/admin/course' />

                        <Route component={PasswordReset} path='/password' />

                        <Route component={LoginForm} path='/login' />
                        <Route exact path='/'><Redirect from='/' to='/login' /></Route>

                        {/* FIXME: Add 404 routing */}
                    </Switch>

                    <div className='card-footer has-background-grey-lighter is-justify-content-center py-6'>
                        <div className='has-text-centered py-6'>
                            <p>
                                Designed with <a href='https://bulma.io' rel='noopener noreferrer' target='_blank'>Bulma</a>
                            </p>

                            <p>
                                Powered by
                                <a href='https://reactjs.org' rel='noopener noreferrer' target='_blank'> React</a>,
                                <a href='https://nodejs.org/' rel='noopener noreferrer' target='_blank'> Node.js</a>, and
                                <a href='https://www.mysql.com/' rel='noopener noreferrer' target='_blank'> MySQL</a>
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            </Provider>
        );
    }
}

export default App;

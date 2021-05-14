import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import ProgressChart from '../progress/ProgressChart';

class Info extends React.Component {
    constructor(props) {
        super(props);

        this.getList = this.getList.bind(this);
        this.showPrintButton = this.showPrintButton.bind(this);
        this.cleanUp = this.cleanUp.bind(this);

        this.studentFields = [
            'nscc_id', 'first_name',
            'last_name', 'start_date',
            'end_date', 'advisor', 'comment'
        ];
        this.courseFields = [
            'course_code', 'course_name',
            'course_desc', 'number_credits',
            'number_units', 'comment'
        ];
        this.facultyFields = ['nscc_id', 'first_name', 'last_name', 'comment'];

        this.state = {item: {}};
    }

    componentDidMount() {
        if (this.props.match.params.id) { this.fetch(); }
    }

    componentDidUpdate(prevProps) {
        let prevParams = prevProps.match.params;
        let thisParams = this.props.match.params;
        let toggled = (prevProps.show !== this.props.show) && this.props.show;

        if (thisParams.id) {
            if (prevParams.id !== thisParams.id) {
                this.fetch();
            } else if (toggled) { this.fetch(); }
        }
    }

    fetch() {
        let params = this.props.match.params;
        let route = `${this.props.api_url}/${this.props.type}/get/${params.id}`;

        axios({
            headers: { 'token': localStorage.getItem('token') },
            method: 'GET',
            timeout: 10000,
            url: route
        }).then(response => {
            let item = {};
            let type = this.props.type === 'course' ? 'courses' : 'users';

            if (response.data[type]) { item = response.data[type]; }

            this.setState({item: item});
        }).catch(error => {
            try {
                localStorage.removeItem('token');

                if (error.response.status === 401) {
                    this.setState({item: {}}, () => {
                        localStorage.setItem('msg', error.response.data.text);
                        this.props.history.push('/');

                        return;
                    });

                    return;
                }

                localStorage.setItem('token', error.response.headers.token);
                this.setState({item: {}});
            } catch (exception) {
                this.setState({item: this.state.item});
            }
        });
    }

    getList() {
        switch (this.props.type) {
            case 'student':
                return this.studentFields;
            case 'faculty':
                return this.facultyFields;
            default:
                return this.courseFields;
        }
    }

    showPrintButton() {
        if (this.props.type !== 'student') { return null; }

        let params = this.props.match.params;
        let isPrinting = this.props.match.path.includes('/print');

        if (isPrinting) { return null; }

        return (
            <p>
                <Link className='button inline is-info'
                    target='_blank'
                    to={{pathname: `/print/student/${params.id}`}}>
                    Print
                </Link>
            </p>
        );
    }

    cleanUp(string) {
        let lower = string.split('_');
        let words = '';

        switch (lower[1]) {
            case 'id':
                return 'ID';
            case 'desc':
                lower.pop();
                lower.push('description');
                break;
            default:
                break;
        }

        if (lower[0] === 'number') {
            let second = lower.pop();

            lower.push('of');
            lower.push(second);
        }

        lower.forEach(word => {
            if (word === 'of') {
                words += 'of ';
                return;
            }

            words += `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()} `;
        });

        return words.substr(0, words.length - 1);
    }

    render() {
        if (!this.props.show) { return null; }

        let isStudent = this.props.location.pathname.includes('/student/');

        return (
            <React.Fragment>
                <h1 className='title'>
                    {this.props.type.substring(0, 1).toUpperCase() +
                    this.props.type.substring(1, this.props.type.length) +
                    ' Information'}
                </h1>

                {this.getList().map(string => {
                    if (!this.state.item[string]) { return null; }

                    return (
                        <React.Fragment key={'info-panel-' + string}>
                            <label className='has-text-weight-bold'>{this.cleanUp(string)}:</label>
                            <p className='info-string'>{this.state.item[string]}</p>
                        </React.Fragment>
                    );
                })}

                <ProgressChart edit={false} show={isStudent} />
            </React.Fragment>
        );
    }
}

Info.propTypes = {
    api_url: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    api_url: state.misc.api_url
});

export default withRouter(connect(mapStateToProps)(Info));

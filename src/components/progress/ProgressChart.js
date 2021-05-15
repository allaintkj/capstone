import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../../redux/actions/misc';

class ProgressChart extends React.Component {
    constructor(props) {
        super(props);

        this.addRow = this.addRow.bind(this);
        this.buildTableBody = this.buildTableBody.bind(this);
        this.buildTableHead = this.buildTableHead.bind(this);
        this.buildTableRow = this.buildTableRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.fetchProgress = this.fetchProgress.bind(this);
        this.findMostUnits = this.findMostUnits.bind(this);
        this.getNumUnits = this.getNumUnits.bind(this);
        this.saveProgress = this.saveProgress.bind(this);
        this.showControls = this.showControls.bind(this);
        this.showTrash = this.showTrash.bind(this);

        this.courseDropdown = [];
        this.newCourse = false;

        this.state = {
            error: false,
            progress: [],
            success: false
        };
    }

    addRow() {
        let progress = this.state.progress;
        let unitObject = {};

        let array = progress.filter(progressEntry => {
            return progressEntry.course.code === this.newCourse.course_code;
        });

        if (array[0]) {
            this.setState({
                error: false,
                success: false
            });

            return;
        }

        for (let i = 1; i <= this.newCourse.number_units; i++) {
            unitObject = {
                ...unitObject,
                [i]: false
            };
        }

        progress.push({
            comments: '',
            course: {
                code: this.newCourse.course_code,
                name: this.newCourse.course_name,
                units: this.newCourse.number_units
            },
            final: '',
            units: unitObject
        });

        this.setState({
            error: false,
            progress: progress,
            success: false
        });
    }

    buildTableBody() {
        let progress = this.state.progress;
        let tableBody = [];

        progress.sort((first, second) => {
            if (first.course.name < second.course.name) { return -1; }
            if (first.course.name > second.course.name) { return 1; }
            return 0;
        });

        progress.forEach(progressEntry => {
            let row = this.buildTableRow(progressEntry);
            tableBody.push(row);
        });

        if (this.props.edit) {
            let courses = this.props.courses;
            this.courseDropdown = [];

            courses.forEach(course => { this.courseDropdown.push(course); });

            try {
                this.newCourse = this.courseDropdown[0];
            } catch (exception) {
                return tableBody;
            }
        }

        return tableBody;
    }

    buildTableHead() {
        let tableHead = [<th key={'progress-tablehead-course'}>Course</th>];
        let decoded = jwt.decode(localStorage.getItem('token'));

        if (decoded.type !== 'student') {
            tableHead.push(<th key={'progress-tablehead-comments'}>Comments</th>);
            tableHead.push(<th key={'progress-tablehead-final'}>Final</th>);
        }

        for (let i = 1; i <= this.findMostUnits(); i++) {
            tableHead.push(<th key={`progress-tablehead-unit-${i}`}>Unit {i}</th>);
        }

        return <tr>{tableHead}</tr>;
    }

    buildTableRow(progressEntry) {
        let code = progressEntry.course.code;
        let comments = progressEntry.comments ? progressEntry.comments : '';
        let decoded = jwt.decode(localStorage.getItem('token'));
        let final = progressEntry.final ? progressEntry.final : '';
        let key = Math.random();
        let name = progressEntry.course.name;
        let row = [];

        row.push(
            <th key={`progress-tablerow-${code}-${key}`} title={`${code} ${name}`}>
                {code}
                {this.showTrash(progressEntry)}
            </th>
        );

        if (this.props.edit) {
            row.push(
                <td key={`progress-tablerow-${code}-${key}-comments`}>
                    <input className='input'
                        defaultValue={progressEntry.comments}
                        name={code + '-comments'}
                        onKeyUp={this.update.bind(this, progressEntry)}
                        placeholder='comment'
                        title={progressEntry.comments}
                        type='text'
                    />
                </td>
            );

            let markOptions = [
                <option key={`progress-tablerow-${code}-${key}-final-option-${null}`}
                    value={false}>
                    N/A
                </option>
            ];

            for (let i = 0; i <= 100; i++) {
                markOptions.push(
                    <option key={`progress-tablerow-${code}-${key}-final-option-${i}`}
                        value={i}>
                        {i}
                    </option>
                );
            }

            row.push(
                <td key={`progress-tablerow-${code}-${key}-final`}>
                    <div className='select'>
                        <select name={`${code}-final`}
                            onChange={this.update.bind(this, progressEntry)}
                            title={progressEntry.final}
                            value={progressEntry.final}>
                            {markOptions}
                        </select>
                    </div>
                </td>
            );
        } else if (decoded.type !== 'student') {
            row.push(<td key={`progress-tablerow-${code}-${key}-comments`}>{comments}</td>);
            row.push(<td key={`progress-tablerow-${code}-${key}-final`}>{final}</td>);
        }

        for (let i = 1; i <= this.getNumUnits(progressEntry); i++) {
            let string = progressEntry.units[i] ? progressEntry.units[i] : '';

            if (this.props.edit) {
                row.push(
                    <td key={`progress-tablerow-${code}-${key}-unit-${i}`}>
                        <input className='input'
                            defaultValue={progressEntry.units[i]}
                            name={code + '-' + i}
                            onChange={this.update.bind(this, progressEntry)}
                            type='date' />
                    </td>
                );
            } else {
                row.push(
                    <td key={`progress-tablerow-${code}-${key}-unit-${i}`}>
                        {string}
                    </td>
                );
            }
        }

        for (let i = progressEntry.course.units + 1; i <= this.findMostUnits(); i++) {
            row.push(
                <td key={`progress-tablerow-${code}-${key}-unit-${i}`}>
                    --
                </td>
            );
        }

        return (
            <tr key={`progress-tablerow-${code}-${key}-wrapper`}
                title={`${code} ${name}`}>
                {row}
            </tr>
        );
    }

    deleteRow(progressEntry) {
        let progress = this.state.progress.filter(entry => entry !== progressEntry);

        this.setState({
            error: false,
            progress: progress,
            success: false
        });
    }

    fetchProgress() {
        let params = this.props.match.params;
        let route = `${this.props.api_url}/progress/${params.id}`;
        let isStudent = params.type !== 'faculty' && params.type !== 'course';

        if (!params.id || !isStudent) { return; }

        axios({
            headers: { 'token': localStorage.getItem('token') },
            method: 'GET',
            timeout: 10000,
            url: route
        }).then(response => {
            this.setState({progress: response.data.progress});
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

    findMostUnits() {
        let progress = this.state.progress;
        let unitNumbers = [];

        progress.forEach(progressEntry => { unitNumbers.push(progressEntry.course.units); });

        return Math.max.apply(Math, unitNumbers);
    }

    getNumUnits(progressEntry) {
        let numUnits = [];

        for (let unit in progressEntry.units) { numUnits.push(unit); }

        return numUnits.length;
    }

    saveProgress() {
        let params = this.props.match.params;
        let route = `${this.props.api_url}/progress/${params.id}`;

        axios({
            data: this.state,
            headers: { 'token': localStorage.getItem('token') },
            method: 'POST',
            timeout: 10000,
            url: route
        }).then(response => {
            localStorage.removeItem('token');
            localStorage.setItem('token', response.headers.token);
            this.setState({
                error: false,
                success: true
            });
        }).catch(error => {
            localStorage.removeItem('token');

            if (error.response.status === 401) {
                localStorage.setItem('msg', error.response.data.text);
                this.props.history.push('/');

                return;
            }

            localStorage.setItem('token', error.response.headers.token);
            this.setState({
                error: true,
                success: false
            });
        });
    }

    showControls() {
        if (!this.props.edit) { return null; }

        let courseOptions = [];

        courseOptions = this.courseDropdown.map(course => {
            return (
                <option key={JSON.stringify(course)}
                    title={`${course.course_code} ${course.course_name}`}
                    value={JSON.stringify(course)}>
                    {course.course_code}
                </option>
            );
        });

        return (
            <div className='has-text-centered'>
                <div className='select'>
                    <select onChange={event => { this.newCourse = JSON.parse(event.target.value); }}>
                        {courseOptions}
                    </select>
                </div>

                <div className='column buttons'>
                    <div className='button is-info is-small' onClick={this.addRow}>
                        Add Record
                    </div>

                    <div className='button is-success is-small' onClick={this.saveProgress}>
                        Save Progress
                    </div>
                </div>
            </div>
        );
    }

    showTrash(progressEntry) {
        if (!this.props.edit) { return null; }

        return (
            <React.Fragment>
                <br />
                <span className='icon is-small'>
                    <i className='fas fa-times has-text-danger'
                        onClick={() => this.deleteRow(progressEntry)}
                        title='Delete Record' />
                </span>
            </React.Fragment>
        );
    }

    update(progressEntry, event) {
        let name = event.target.name.split('-')[1];
        let newEntry = {};
        let otherProgress = this.state.progress.filter(entry => entry !== progressEntry);

        if (isNaN(name)) {
            // comment or final
            if (event.keyCode && (event.keyCode !== 13)) { return; }

            newEntry = {
                ...progressEntry,
                [name]: event.target.value
            };
        } else {
            // unit number
            newEntry = {
                ...progressEntry,
                units: {
                    ...progressEntry.units,
                    [name]: event.target.value
                }
            };
        }

        otherProgress.push(newEntry);
        this.setState({
            error: false,
            progress: otherProgress,
            success: false
        });
    }

    render() {
        if (!this.props.show || (this.state.progress.length < 1 && !this.props.edit)) { return null; }

        return (
            <React.Fragment>
                <hr />
                <h1 className='title'>Progress Chart</h1>

                <p className={this.props.edit ? '' : 'is-hidden'}>
                    {this.props.edit ? 'Press the enter key after typing a comment to make sure the field is updated' : ''}
                </p>

                <div className='table-container'>
                    <table className='table is-fullwidth is-hoverable'>
                        <thead>{this.buildTableHead()}</thead>
                        <tbody>{this.buildTableBody()}</tbody>
                    </table>
                </div>

                <div className={(this.state.success || this.state.error) ? '' : 'is-hidden'}>
                    <p className={`has-text-centered has-text-${this.state.error ? 'danger' : 'success'}`}>
                        <span className='help'>
                            {this.state.success ? 'Progress updated' : (this.state.error ? 'Unknown error updating progress' : '')}
                        </span>
                    </p>
                </div>

                {this.showControls()}
            </React.Fragment>
        );
    }
}

ProgressChart.propTypes = {
    api_url: PropTypes.string.isRequired,
    courses: PropTypes.arrayOf(PropTypes.object),
    edit: PropTypes.bool.isRequired,
    fetch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
    fetch: (url, params, successCb, errorCb) => dispatch(fetch(url, params, successCb, errorCb))
});

const mapStateToProps = state => ({
    api_url: state.misc.api_url,
    courses: state.arrays.course
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProgressChart));

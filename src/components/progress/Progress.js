import PropTypes from 'prop-types';
import React from 'react';

class Progress extends React.Component {
    constructor(props) {
        super(props);

        this.getUnitsPerWeek = this.getUnitsPerWeek.bind(this);
        this.progressEmpty = this.progressEmpty.bind(this);

        this.week =  604800000;
    }

    calcEndDate() {
        if (this.progressEmpty()) { return ''; }

        let progress = this.props.selected.progress;
        let totalUnits = 0;
        let unitsComplete = 0;

        for (let course in progress) {

            if (progress[course].course_units) {
                let thisCourse = progress[course];
                totalUnits += thisCourse.course_units;

                for (let unit in thisCourse) {
                    if (isNaN(unit) || unit >= 100) { continue; }
                    if (thisCourse[unit]) { unitsComplete++; }
                }
            }
        }

        let start = new Date(this.props.selected.start_date).getTime();
        let now = new Date().getTime();
        let weeksComplete = (now - start) / this.week;
        let unitsPerWeek = unitsComplete / weeksComplete;
        let weeksLeft = (totalUnits / unitsPerWeek).toFixed(2);
        let date = new Date(now + (weeksLeft * this.week));

        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        let day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        let dateString = `(${year}-${month}-${day})`;

        if (isNaN(year) || isNaN(month) || isNaN(day)) { dateString = ''; }

        return `${weeksLeft} weeks remaining at current rate of progress ${dateString}`;
    }

    getUnitsPerWeek() {
        if (this.progressEmpty()) { return ''; }

        let progress = this.props.selected.progress;
        let end = new Date(this.props.selected.end_date).getTime();
        let now = new Date().getTime();
        let weeks_left = (end - now) / this.week;
        let total_units = 0;

        for (let course in progress) {
            if (progress[course].course_units) {
                total_units += progress[course].course_units;
            }
        }

        let unitsPerWeek = (total_units / weeks_left).toFixed(2);

        return `${unitsPerWeek} units per week to complete by end date (${this.props.selected.end_date})`;
    }

    progressEmpty() {
        let hasOwnProperty = Object.prototype.hasOwnProperty;
        let progress = this.props.selected.progress;

        for (let key in progress) {
            if (hasOwnProperty.call(progress, key)) { return false; }
        }

        return true;
    }

    render() {
        if (this.progressEmpty()) { return null; }

        return (
            <React.Fragment>
                <label className='has-text-weight-bold'>Progress:</label>
                <p>
                    {this.getUnitsPerWeek()}
                    <br />
                    {this.calcEndDate()}
                </p>
            </React.Fragment>
        );
    }
}

Progress.propTypes = {
    selected: PropTypes.object.isRequired
};

export default Progress;

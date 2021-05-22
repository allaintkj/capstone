import React from 'react';
import { connect } from 'react-redux';

/*
*   ProgressChart table for displaying student course completion
*/
class ProgressChart extends React.Component {
    constructor(props) {
        super(props);

        // Default state
        this.state = {
            maxUnits: 0
        };
    }

    componentDidUpdate(lastProps) {
        let lastProgress = lastProps.progress;
        let thisProgress = this.props.progress;

        if ((lastProgress !== thisProgress) && thisProgress) {
            // New progress object
            // Determine the max number of unit columns to render
            let maxUnits = 0;

            thisProgress.forEach(course => {
                if (course.completion.length > maxUnits) {
                    maxUnits = course.completion.length;
                }
            });

            // Set in state
            this.setState({
                maxUnits: maxUnits
            });
        }
    }

    render() {
        // If there's no progress don't render the chart
        if ((!this.props.progress) || (!this.props.progress[0])) { return null; }

        return (
            <React.Fragment>
                <hr />
                <h1 className='title'>Progress Chart</h1>

                <div className='table-container'>
                    <table className='table is-fullwidth is-hoverable'>
                        <thead>
                            <tr>
                                <th>Course</th>

                                {/* Build table headers */}
                                {new Array(this.state.maxUnits).fill(0).map((element, index) => {
                                    if (index === 0) { return <th key={Math.random()}>Final</th>; }
                                    return <th key={Math.random()}>Unit {index}</th>;
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {/* Build table rows and fill cells with completion data */}
                            {this.props.progress.map((progressRecord) => {
                                return (
                                    <tr key={Math.random()}>
                                        <th>{progressRecord.course}</th>

                                        {new Array(this.state.maxUnits).fill(0).map((element, index) => {
                                            let cellData = progressRecord.completion[index];

                                            if (!cellData) { cellData = 'N/A'; }
                                            if (cellData !== '--') {
                                                cellData = (cellData === 'N/A') ?
                                                    cellData :
                                                    new Date(cellData).toString().substring(3, 15);
                                            }

                                            return (
                                                <td key={Math.random()}>
                                                    {cellData}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    // Progress reducer
    progress: state.progress.data
});

export default connect(mapStateToProps)(ProgressChart);

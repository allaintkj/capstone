import React from 'react';

class CourseInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>

                <h1 className='title'>
                    {'Course Information'}
                </h1>

                <div>
                    <label className='has-text-weight-bold'>{'Course Code:'}</label>
                    <p className='info-string'>{}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Course Name:'}</label>
                    <p className='info-string'>{}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Course Description:'}</label>
                    <p className='info-string'>{}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Number of Credits:'}</label>
                    <p className='info-string'>{}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Number of Units:'}</label>
                    <p className='info-string'>{}</p>
                </div>

                <div>
                    <label className='has-text-weight-bold'>{'Comments:'}</label>
                    <p className='info-string'>{}</p>
                </div>

            </React.Fragment>
        );
    }
}

export default CourseInformation;

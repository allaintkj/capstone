import PropTypes from 'prop-types';
import React from 'react';

class Tabs extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.array.map(tab => {
                    let tab_class = tab.toLowerCase().includes(this.props.active.toLowerCase()) ? 'is-active' : '';
                    let tab_type = tab.toLowerCase();

                    if (tab_type[tab_type.length - 1] === 's') {
                        tab_type = tab_type.substring(0, tab_type.length - 1);
                    }

                    let href = `/dashboard/${this.props.type ? this.props.type + '/' : ''}`;
                    let tab_name = tab_type === 'edit' ? '/' + tab_type : '';
                    href += `${this.props.itemId ? this.props.itemId : tab_type}${tab_name}`;

                    return (
                        <li className={tab_class} key={'tab_li' + tab}>
                            <a className='is-size-7' href={href} key={'tab_a' + tab}>
                                {tab}
                            </a>
                        </li>
                    );
                })}
            </React.Fragment>
        );
    }
}

Tabs.propTypes = {
    active: PropTypes.string.isRequired,
    array: PropTypes.arrayOf(PropTypes.string).isRequired,
    itemId: PropTypes.string,
    type: PropTypes.string
};

export default Tabs;

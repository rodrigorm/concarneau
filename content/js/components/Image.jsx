'use strict';

var Image = React.createClass({
    componentDidMount: function componentDidMount() {
        this.componentWillReceiveProps(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(props) {
        this.getDOMNode().setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.props.src);
    },

    render: function render() {
		return (
            <image {...this.props} />
        );
    }
});

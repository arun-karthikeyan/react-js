var Button = React.createClass({
getInitialState() {return {counter: 0};},
handleClick() {this.setState({counter: this.state.counter+1});},
render() {return (<button onClick={this.handleClick}>{this.state.counter}</button>);}
});

ReactDOM.render(<Button />, document.getElementById("root"));

var Button = React.createClass({
  localHandleClick() {
    this.props.localHandleClick(this.props.increment);
  },
  render() {return < button onClick = {this.localHandleClick} > {this.props.increment} < /button>;}
});

var Result = React.createClass({
  render() {
    return <div>{this.props.localCounter}</div>
  }
});

var Main = React.createClass({
  getInitialState(){return {counter: 0};},
  handleClick(increment){
    this.setState(previousState => {
      return {
        counter: previousState.counter+increment
      };
    })
  },
  render(){
    return (
      <div>
      <Button localHandleClick={this.handleClick} increment={1}/>
      <Button localHandleClick={this.handleClick} increment={2}/>
      <Button localHandleClick={this.handleClick} increment={5}/>
      <Button localHandleClick={this.handleClick} increment={10}/>
      <Result localCounter={this.state.counter}/>
      </div>
    );
  }
});

ReactDOM.render( <Main / > , document.getElementById("root"));

var Card = React.createClass({
  getInitialState(){
    return {};
  },
  render(){
    if(this.state.shouldRender){
    return (
      <div>
      <img src={this.state.avatar_url} width="80px"/>
      <h3>{this.state.name}</h3>
      <hr/>
      </div>

    );
  }
    return false;
  },
  componentWillMount(){
    $.get('https://api.github.com/users/'+this.props.username,({avatar_url, name}) => this.setState({avatar_url, name, shouldRender: true}))
    .fail(() => this.setState({shouldRender: false}));
  }
});
var Form = React.createClass({
  handleSubmit(e){
    e.preventDefault();
    var loginInput = ReactDOM.findDOMNode(this.refs.login);
    this.props.addCard(loginInput.value);
    loginInput.value='';
  },
  render(){
    return (
      <form onSubmit={this.handleSubmit} style={{marginBottom: '20px'}}>
      <input type="text" placeholder="github login" ref="login"/>
      <button style={{marginLeft: '20px'}}>Add</button>
      </form>
    )
  }
})
var Main = React.createClass({
  getInitialState(){
    return {logins: []};
  },
  addCard(loginValue){
    this.setState(previousState => {return {logins: previousState.logins.concat(loginValue)}});
  }
  ,
  render(){
    var cardsJSX = this.state.logins.map((username,index) => { return (<Card key={index} username={username} />);});
    return (
      <div>
      <Form addCard={this.addCard}/>
      {cardsJSX}
      </div>
    );
  }
});

ReactDOM.render(<Main/>, document.getElementById('root'));

var StarsFrame = React.createClass({
  render(){
    var starsJSX = [];
    var numberOfStars = this.props.numberOfStars;
    for(let i=0; i<numberOfStars; ++i){
      starsJSX.push((<span key={i} className="glyphicon glyphicon-star"></span>));
    }
    return (
      <div id="stars-frame">
      <div className="well">
      {starsJSX}
      </div>
      </div>
    );
  }
});

var ButtonFrame = React.createClass({
  render(){
    var disabled, correct = this.props.correct, button;
    switch(correct){
      case true:
      button = (<button id="status-button" className="btn btn-success btn-lg" disabled={disabled} onClick={this.props.acceptAnswer}><span className="glyphicon glyphicon-ok"></span></button>);
      break;
      case false:
      button = (<button id="status-button" className="btn btn-danger btn-lg" disabled={disabled}><span className="glyphicon glyphicon-remove"></span></button>);
      break;
      default:
      disabled = this.props.selectedNumbers.length==0;
      button = (<button id="status-button" className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>=</button>);
    }
    return (
      <div id="button-frame">
      {button}
      <button id="refresh-button" className="btn btn-warning btn-xs" onClick={this.props.redraw} disabled={this.props.redrawsLeft==0}><span className="glyphicon glyphicon-refresh"></span> {this.props.redrawsLeft}</button>
      </div>
    );
  }
});

var AnswerFrame = React.createClass({
  render(){
    var selectedNumbersJSX = [];
    for(let i=0; i<this.props.selectedNumbers.length; ++i){
      var onClickFunction = this.props.removeSelectedNumber;
      selectedNumbersJSX.push((<div className="number" key={this.props.selectedNumbers[i]} onClick={onClickFunction.bind(null,this.props.selectedNumbers[i])}>{this.props.selectedNumbers[i]}</div>));
    }
    return (
      <div id="answer-frame">
      <div className="well">
      {selectedNumbersJSX}
      </div>
      </div>
    );
  }
});

var NumbersFrame = React.createClass({
  render(){
    var numbersJSX = [];
    var onClickFunction = this.props.addSelectedNumber;
    for(let i=1; i<10; ++i){
      let className = 'number selected-'+(this.props.selectedNumbers.indexOf(i)>=0)+(this.props.usedNumbers.indexOf(i)>=0?' used':'');
      numbersJSX.push((<div className={className} key={i} onClick={onClickFunction.bind(null,i)}>{i}</div>));
    }
    return (
      <div id="number-frame">
      <div className="well">
      {numbersJSX}
      </div>
      </div>
    );
  }
});

var DoneFrame = React.createClass({
  render(){
    return (
      <div id="done-frame">
      <div className="well">
        <div className="row">
          <div className="col-xs-12">
            {this.props.doneStatus}
          </div>
          <div className="col-xs-12">
            <button className="btn btn-default" onClick={this.props.resetGame}>Play Again</button>
          </div>
        </div>
      </div>
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState(){
    var that = this;
    return {selectedNumbers: [], numberOfStars: that.getNumberOfStars(), correct: null, usedNumbers: [], redrawsLeft: 5, doneStatus: null};
  },
  addSelectedNumber(number){
    if(this.state.selectedNumbers.indexOf(number)<0 && this.state.usedNumbers.indexOf(number)<0){ //so that we don't select already selected numbers
    this.setState(previous => {return {selectedNumbers: previous.selectedNumbers.concat(number), correct: null};});
  }
},
resetGame(){
  this.replaceState(this.getInitialState());
},
redraw(){
  var that = this;
  let redrawsLeft = this.state.redrawsLeft;
  if(redrawsLeft>0){
    this.setState({numberOfStars: that.getNumberOfStars(), correct: null, selectedNumbers: [], redrawsLeft: redrawsLeft-1}, function(){this.updateDoneStatus();});
  }
},
updateDoneStatus(){
  if(this.state.usedNumbers.length==9){
    this.setState({doneStatus: "You've won ! Congratulations !!", numberOfStars: 0});
  }
  else
  if(this.state.redrawsLeft==0 && !this.solutionPossible()){
    this.setState({doneStatus: "You've lost ! Game Over !!", numberOfStars: 0});
  }
  return;
},
solutionPossible(){
  let requiredSum = this.state.numberOfStars;
  let arraySum = new Array(requiredSum+1);
  arraySum[0] = true;
  let numbersLeft = [];
  for(let i=1; i<10; ++i){
    if((this.state.usedNumbers.indexOf(i)<0) && (i<=requiredSum)){
      numbersLeft.push(i);
    }
  }
  for(let i=0,iLen=numbersLeft.length; i<iLen; ++i){
    let currentNo = numbersLeft[i];
    for(let j=0,jLen=arraySum.length-1; j<jLen; ++j){
      if(!arraySum[j] || currentNo==j){
        continue;
      }
      let currentSum = j+currentNo;
      if(currentSum <= requiredSum){
        arraySum[currentSum] = true;
      }
    }
  }
  return arraySum[requiredSum];
},
getNumberOfStars(){
  return Math.floor(Math.random()*9)+1;
},
removeSelectedNumber(number){
  if(this.state.selectedNumbers.indexOf(number)>=0){ //so that we don't remove a number that is already not selected
  this.setState(previous => {previous.selectedNumbers.splice(previous.selectedNumbers.indexOf(number),1);return {selectedNumbers: previous.selectedNumbers, correct: null}});
}
},
checkAnswer(){
  let correct = this.state.numberOfStars==this.sumOfSelectedNumbers();
  this.setState({correct});
},
sumOfSelectedNumbers(){
  let sum = 0;
  for(let i=0; i<this.state.selectedNumbers.length; ++i){
    sum = sum + this.state.selectedNumbers[i];
  }
  return sum;
},
acceptAnswer(){
  var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
  var that = this;
  this.setState({
    selectedNumbers: [],
    usedNumbers,
    correct: null,
    numberOfStars: that.getNumberOfStars()
  }, function(){
    this.updateDoneStatus();
  });
},
render(){
  var selectedNumbers = this.state.selectedNumbers, numberOfStars = this.state.numberOfStars, correct = this.state.correct, usedNumbers = this.state.usedNumbers, redrawsLeft = this.state.redrawsLeft;
  var bottomFrame = this.state.doneStatus?(<DoneFrame doneStatus={this.state.doneStatus} resetGame={this.resetGame}/>):(<NumbersFrame selectedNumbers={selectedNumbers} addSelectedNumber={this.addSelectedNumber} usedNumbers={usedNumbers}/>);
  return (
    <div id="game" className="row">
    <div className="col-xs-12" style={{textAlign: 'center'}}>
    <h2>Play Nine</h2>
    <hr />
    </div>
    <div className="col-xs-5">
    <StarsFrame numberOfStars={numberOfStars}/>
    </div>
    <div className="col-xs-2">
    <ButtonFrame selectedNumbers={selectedNumbers} correct={correct} checkAnswer={this.checkAnswer} acceptAnswer={this.acceptAnswer} redraw={this.redraw} redrawsLeft={redrawsLeft}/>
    </div>
    <div className="col-xs-5">
    <AnswerFrame selectedNumbers={selectedNumbers} removeSelectedNumber={this.removeSelectedNumber}/>
    </div>
    <div className="col-xs-12">
    {bottomFrame}
    </div>
    </div>
  )
}
});

ReactDOM.render(<Game />, document.getElementById('root'));

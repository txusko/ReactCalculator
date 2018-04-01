import React, { Component } from 'react';
import './App.css';

class Screen extends Component {
  render() {
    return (
      <div>
        <input className="screen" type="text" readOnly
          value={this.props.result} />
      </div>
    );
  }
}

const CalcButton = (num, callback, classNames) => {
  return (
    <span key={num} className={classNames} 
      onClick={() => callback(num)}>{num}</span>
  );
}

class Numbers extends Component {
  render() {
    let numbers = [
      CalcButton("C", this.props.onClickFunction, "number operator"),
      CalcButton("±", this.props.onClickFunction, "number operator"),
      CalcButton("%", this.props.onClickFunction, "number operator"),
      CalcButton("/", this.props.onClickFunction, "number operator"),
      CalcButton(7, this.props.onClickFunction, "number"),
      CalcButton(8, this.props.onClickFunction, "number"),
      CalcButton(9, this.props.onClickFunction, "number"),
      CalcButton("*", this.props.onClickFunction, "number operator"),
      CalcButton(4, this.props.onClickFunction, "number"),
      CalcButton(5, this.props.onClickFunction, "number"),
      CalcButton(6, this.props.onClickFunction, "number"),
      CalcButton("-", this.props.onClickFunction, "number operator"),
      CalcButton(1, this.props.onClickFunction, "number"),
      CalcButton(2, this.props.onClickFunction, "number"),
      CalcButton(3, this.props.onClickFunction, "number"),
      CalcButton("+", this.props.onClickFunction, "number operator"),
      CalcButton(0, this.props.onClickFunction, "number zero"),
      CalcButton(".", this.props.onClickFunction, "number"),
      CalcButton("=", this.props.onClickFunction, "number equal")
    ];
    return (
      <div className="numbers">
      {numbers}
      </div>
    );
  }
}

class Calculator extends Component {
  state = { result: "0", reset: false };
  
  calculateResult = (number) => {
    this.setState((prevState) => ({
      result: this.calculate(number, prevState.result),
      reset: (number === "=" || number === "%"),
      lastAction: (number === "=" ? this.getLastAction(prevState.result) : "")
    }));
  };
  
  getLastAction = (expr) => {
    var pos = expr.indexOf('+');
    if (pos <= 0) pos = expr.indexOf('-') > 0;
    if (pos <= 0) pos = expr.indexOf('*') > 0;
    if (pos <= 0) pos = expr.indexOf('/') > 0;
    return pos > 0 ? expr.substring(pos + 1) : this.state.lastAction;
  };
  
  calculate = (character, input, reset = false) => {
    input = this.verifyInput(input, character);
    var ret = "0";
    switch (character) {
      case "C": ret = "0"; break;
      case "±": ret = this.getMesMenys(input, ret); break;
      case "%": ret = this.getPercent(input); break;
      case "=": ret = this.evaluateExpression(input, true); break;
      default: ret = this.addNormal(input, ret, character); break;
    }
    return ret.toString();
  };
  
  getPercent = (input) => {
    return (this.evaluateExpression(input) / 100).toString();
  };
  
  getMesMenys = (input, ret) => {
    ret = ret.toString();
    if (input !== "0") {
      switch (input.charAt(0)) {
        case "-": ret = input.substring(1); break;
        case "+": ret = "-" + input.substring(1); break;
        default: ret = "-" + input; break;    
      }
    }
    return ret;
  };
  
  addNormal = (res, ret, num) => {
    var lstC = res.slice(-1);
    var nIsOp = (num === "+" || num === "-" || num === "/" || num === "*");
    var lIsOp = (lstC === "+" || lstC === "-" || lstC === "/" || lstC === "*");
    var isEvaluable = (res.indexOf('+') > 0 || res.indexOf('-') > 0 
                      || res.indexOf('*') > 0 || res.indexOf('/') > 0);
    var isInt = Number.isInteger(num);
    if (res === "0" && isInt) {
      ret = num.toString();
    } else if (num === '.' && res.indexOf('.') > 0) {
      if ((res.match(/\./g) || []).length <= 1)
        ret = isEvaluable && !lIsOp ? res + num.toString() : "0.";
    } else if (nIsOp && lstC === ".") {
      ret = res;
    } else if (nIsOp && lIsOp) {
      ret = res.substring(0, res.length - 1) + num.toString();
    } else if (!isInt && isEvaluable && num !== ".") {
      ret = this.evaluateExpression(res) + num.toString();
    } else {
      ret = res + num.toString();
    }
    return ret;
  };
  
  verifyInput = (res, num) => {
    if (res === null || res === undefined)
      res = "0";
    res = res.toString();
    if (res === "NaN" || res === "Infinity")
      res = "0";
    if (this.state.reset && Number.isInteger(num)) {
      res = "0";
    }
    return res;
  };
  
  evaluateExpression = (expr, lastAction = false) => {
    if (lastAction && this.state.lastAction !== "") {
      expr = expr + this.state.lastAction;
    }
    return this.evaluate(expr);
  };
  
  evaluate = (expr) => {
    var chars = expr.split("");
    var n = [], op = [], index = 0, oplast = true;
    n[index] = "";
    // Parse the expression
    for (var c = 0; c < chars.length; c++) {
      if (isNaN(parseInt(chars[c], 10)) && chars[c] !== "." && !oplast) {
        op[index] = chars[c];
        index++;
        n[index] = "";
        oplast = true;
      } else {
        n[index] += chars[c];
        oplast = false;
      }
    }
    // Calculate the expression
    expr = parseFloat(n[0]);
    for (var o = 0; o < op.length; o++) {
      var num = parseFloat(n[o + 1]);
      switch (op[o]) {
        case "+": expr = expr + num; break;
        case "-": expr = expr - num; break;
        case "*": expr = expr * num; break;
        case "/": expr = expr / num; break;
        default:  break;
      }
    }
    return expr;
  };
  
  render() {
    return (
      <div className="calculator">
        <Screen result={this.state.result} />
        <Numbers onClickFunction={this.calculateResult} />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Calculator />
      </div>
    );
  }
}

export default App;

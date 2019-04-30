import { DateInput } from "semantic-ui-calendar-react";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Form } from "semantic-ui-react";
import autoBind from "react-autobind";
import moment from "moment";
import "semantic-ui-css/semantic.min.css";

export default class DateEditor extends React.Component {
  browserLocale = window.navigator.userLanguage || window.navigator.language;
  constructor(props) {
    super(props);
    this.state = { dateEditor: "" };
    //moment(props.value).format('L')
  }
  getValue() {
    //return { date: moment(this.state.dateEditor).format("L") };
    //let date = moment(this.state.dateEditor).format('')
    return { finish_by_date: this.state.dateEditor };
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
  }

  handleChange = (event, { name, value }) => {
    //this.setState({ [name]: value }, () => this.props.onCommit());
    let localDate = moment(value)
      .locale(this.browserLocale)
      .format("L");
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: localDate }, () => this.props.onCommit()); //);); //, () => this.props.onCommit()); //);
      console.log(value);
      console.log(localDate);
    }
  };

  render() {
    return (
      <Form>
        <DateInput
          name="dateEditor"
          dateFormat="L"
          localization={this.browserLocale}
          placeholder="Date"
          value={this.state.dateEditor}
          //{moment(this.state.date).format('L')}
          iconPosition="left"
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}

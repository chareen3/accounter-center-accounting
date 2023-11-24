import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";

class CheckboxIndependant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  handleInputChange = event => {
    this.setState({
      checked: event.target.checked
    });
  };

  render() {
    const newProps = Object.assign(
      {
        onChange: this.handleInputChange,
        checked: this.state.checked
      },
      this.props
    );
    return <Checkbox {...newProps} />;
  }
}

export default CheckboxIndependant;

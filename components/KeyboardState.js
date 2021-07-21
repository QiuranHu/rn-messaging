import { Keyboard, Platform } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const INITIAL_ANIMATION_DURATION = 250;

export default class KeyboardState extends React.Component {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      layout: { height },
    } = props;

    this.state = {
      contentHeight: height,
      keyboardHeight: 0,
      keyboardVisible: false,
      keyboardWillShow: false, // iOS only: the keyboard is going to appear.
      keyboardWillHide: false, // iOS only: the keyboard is going to disappear.
      keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
    };
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.subscriptions = [
        Keyboard.addListener("keyboardWillShow", this.keyboardWillShow),
        Keyboard.addListener("keyboardWillHide", this.keyboardWillHide),
        // The keyboard is now fully visible.
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
        // The keyboard is now fully hidden.
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide),
      ];
    } else {
      this.subscriptions = [
        // The keyboard is now fully visible.
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
        // The keyboard is now fully hidden.
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide),
      ];
    }
  }

  keyboardWillShow = (event) => {
    this.setState({ keyboardWillShow: true });
    this.measure(event);
  };

  keyboardDidShow = (event) => {
    this.setState({
      keyboardWillShow: false,
      keyboardVisible: true,
    });
    this.measure(event);
  };

  measure = (event) => {
    const { layout } = this.props;
    const {
      endCoordinates: { height, screenY },
      duration = INITIAL_ANIMATION_DURATION,
    } = event;
    this.setState({
      // screenY: top coordinate of the keyboard
      // layout.y: top coordinate of our messaging component
      /**
       * y coordinate
       * |  small
       * |
       * |  large
       * ▿
       */
      contentHeight: screenY - layout.y,
      keyboardHeight: height,
      keyboardAnimationDuration: duration,
    });
  };

  keyboardWillHide = (event) => {
    this.setState({ keyboardWillHide: true });
    this.measure(event);
  };

  keyboardDidHide = () => {
    this.setState({
      keyboardWillHide: false,
      keyboardVisible: false,
    });
  };

  componentWillUnmount() {
    this.subscriptions.forEach((subscription) => subscription.remove());
  }

  render() {
    const { children, layout } = this.props;
    const {
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration,
    } = this.state;

    return children({
      containerHeight: layout.height,
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration,
    });
  }
}

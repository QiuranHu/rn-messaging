import { Keyboard, Platform } from "react-native";
import PropTypes from "prop-types";
import React from "react";

export default class KeybaordState extends React.Component {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
  };
}

const INITIAL_ANIMATION_DURATION = 250;

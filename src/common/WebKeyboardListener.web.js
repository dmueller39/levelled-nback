// @flow
import * as React from "react";
import { Dimensions } from "react-native";
import { View } from "react-native";

type Props = {
  children?: React.Node,
  inputKey: string,
  onKeyPress: () => void,
};

function detectTouchScreen() {
  var hasTouchScreen = false;
  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = (navigator: any).msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ("orientation" in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      var UA = navigator.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
}

/* this isn't 100% accurate for our needs. We actually want
something like HAS_KEYBOARD and reverse the conditions below,
BUT this is close enough for the time being. People on touch
screen laptops will be left in the cold :(
*/
const HAS_TOUCH_SCREEN = detectTouchScreen();

export default class WebKeyboardListener extends React.Component<Props> {
  componentDidMount = async () => {
    if (!HAS_TOUCH_SCREEN) {
      document.addEventListener("keydown", this._onKeyDown);
    }
  };

  componentWillUnmount = async () => {
    if (!HAS_TOUCH_SCREEN) {
      document.removeEventListener("keydown", this._onKeyDown);
    }
  };

  _onKeyDown = (evt: any) => {
    if (evt.key == this.props.inputKey) {
      this.props.onKeyPress();
    }
  };

  render() {
    if (!HAS_TOUCH_SCREEN) {
      return <View>{this.props.children}</View>;
    }
    return null;
  }
}

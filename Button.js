'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import LottieView from 'lottie-react-native';


class Button extends Component {
  static propTypes = {
    textStyle: Text.propTypes.style,
    disabledStyle: Text.propTypes.style,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element
    ]),
    accessibilityLabel: PropTypes.string,
    activeOpacity: PropTypes.number,
    allowFontScaling: PropTypes.bool,
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    activityIndicatorColor: PropTypes.string,
    delayLongPress: PropTypes.number,
    delayPressIn: PropTypes.number,
    delayPressOut: PropTypes.number,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    background: (TouchableNativeFeedback.propTypes) ? TouchableNativeFeedback.propTypes.background : PropTypes.any,
    lottieProp: PropTypes.shape({
        source: PropTypes.string,
        duration: PropTypes.number,
        shouldLoop: PropTypes.bool
    })
  }

  static isAndroid = (Platform.OS === 'android')

    constructor() {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
            loop: this.props.lottieProp.shouldLoop,
            duration: this.props.lottieProp.duration,
            source: this.props.lottieProp.source
        };
    }

    componentDidMount() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: this.state.duration,
        }).start();
    }

  _renderChildren() {
    let childElements = [];
    React.Children.forEach(this.props.children, (item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const element = (
          <Text
            style={[styles.textButton, this.props.textStyle]}
            allowFontScaling={this.props.allowFontScaling}
            key={item}>
            {item}
          </Text>
        );
        childElements.push(element);
      } else if (React.isValidElement(item)) {
        childElements.push(item);
      }
    });
    return (childElements);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }
    return false;
  }

  _renderInnerText() {
    if (this.props.isLoading) {
        if (isEmpty(this.props.lottieProp)) {
            return (<ActivityIndicator
                animating={true}
                size='small'
                style={styles.spinner}
                color={this.props.activityIndicatorColor || 'black'}
              />);
        }
      return (
        <LottieView {...this.props.lottieProp} />
      );
    }
    return this._renderChildren();
  }

  render() {
    if (this.props.isDisabled === true || this.props.isLoading === true) {
      return (
        <View style={[styles.button, this.props.style, (this.props.disabledStyle || styles.opacity)]}>
          {this._renderInnerText()}
        </View>
      );
    }
    // Extract Touchable props
    let touchableProps = {
      accessibilityLabel: this.props.accessibilityLabel,
      onPress: this.props.onPress,
      onPressIn: this.props.onPressIn,
      onPressOut: this.props.onPressOut,
      onLongPress: this.props.onLongPress,
      activeOpacity: this.props.activeOpacity,
      delayLongPress: this.props.delayLongPress,
      delayPressIn: this.props.delayPressIn,
      delayPressOut: this.props.delayPressOut,
    };
    if (Button.isAndroid) {
      touchableProps = Object.assign(touchableProps, {
        background: this.props.background || TouchableNativeFeedback.SelectableBackground()
      });
      return (
        <TouchableNativeFeedback {...touchableProps}>
          <View style={[styles.button, this.props.style]}>
            {this._renderInnerText()}
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableOpacity {...touchableProps}
          style={[styles.button, this.props.style]}>
          {this._renderInnerText()}
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textButton: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  spinner: {
    alignSelf: 'center',
  },
  opacity: {
    opacity: 0.5,
  },
});

module.exports = Button;

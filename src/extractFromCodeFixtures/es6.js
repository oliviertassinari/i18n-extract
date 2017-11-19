/* eslint-disable */

// fixture from https://github.com/gaearon/redux-devtools.
import React, { PropTypes, findDOMNode } from 'react';
import LogMonitorEntry from './LogMonitorEntry';
import LogMonitorButton from './LogMonitorButton';
import i18n from 'i18n';
import * as themes from './themes';

const styles = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
  },
  buttonBar: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  elements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 38,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
};

export default class LogMonitor {
  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
    }
  }

  static propTypes = {
    computedStates: PropTypes.array.isRequired,
    currentStateIndex: PropTypes.number.isRequired,
    monitorState: PropTypes.object.isRequired,
    stagedActions: PropTypes.array.isRequired,
    sweep: PropTypes.func.isRequired,
    toggleAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    select: state => state,
    monitorState: {
      isVisible: true,
    },
    theme: 'nicinabox',
  };

  componentWillReceiveProps(nextProps) {
    const node = findDOMNode(this.refs.elements);
    if (!node) {
      this.scrollDown = true;
    } else if (this.props.stagedActions.length < nextProps.stagedActions.length) {
      const { scrollTop, offsetHeight, scrollHeight } = node;

      this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    const node = findDOMNode(this.refs.elements);
    if (!node) {
      return;
    }
    if (this.scrollDown) {
      const { offsetHeight, scrollHeight } = node;
      node.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  handleRollback() {
    this.props.rollback();
  }

  handleSweep() {
    this.props.sweep();
  }

  handleCommit() {
    this.props.commit();
  }

  handleToggleAction(index) {
    this.props.toggleAction(index);
  }

  handleReset() {
    this.props.reset();
  }

  handleKeyPress(event) {
    const { monitorState } = this.props;

    if (event.ctrlKey && event.keyCode === 72) {
      // Ctrl+H
      event.preventDefault();
      this.props.setMonitorState({
        ...monitorState,
        isVisible: !monitorState.isVisible,
      });
    }
  }

  render() {
    const elements = [];
    const { monitorState, skippedActions, stagedActions, computedStates, select } = this.props;
    let theme;
    if (typeof this.props.theme === 'string') {
      if (typeof themes[this.props.theme] !== 'undefined') {
        theme = themes[this.props.theme];
      } else {
        console.warn(`DevTools theme ${this.props.theme} not found, defaulting to nicinabox`);
        theme = themes.nicinabox;
      }
    } else {
      theme = this.props.theme;
    }
    if (!monitorState.isVisible) {
      return null;
    }

    for (let i = 0; i < stagedActions.length; i++) {
      const action = stagedActions[i];
      const { state, error } = computedStates[i];
      let previousState;
      if (i > 0) {
        previousState = computedStates[i - 1].state;
      }
      elements.push(
        <LogMonitorEntry
          key={i}
          index={i}
          theme={theme}
          select={select}
          action={action}
          state={state}
          previousState={previousState}
          collapsed={skippedActions[i]}
          error={error}
          onActionClick={this.handleToggleAction}
        />,
      );
    }

    return (
      <div style={{ ...styles.container, backgroundColor: theme.base00 }}>
        <div style={{ ...styles.buttonBar, borderColor: theme.base02 }}>
          <LogMonitorButton theme={theme} onClick={this.handleReset}>
            {i18n('reset')}
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleRollback}
            enabled={computedStates.length}
          >
            {i18n('revert')}
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleSweep}
            enabled={Object.keys(skippedActions).some(key => skippedActions[key])}
          >
            {i18n('sweep')}
          </LogMonitorButton>
          <LogMonitorButton
            theme={theme}
            onClick={this.handleCommit}
            enabled={computedStates.length > 1}
          >
            {i18n('commit')}
          </LogMonitorButton>
        </div>
        <div style={styles.elements} ref="elements">
          {elements}
        </div>
      </div>
    );
  }
}

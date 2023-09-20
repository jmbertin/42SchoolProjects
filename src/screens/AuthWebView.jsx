import React from 'react';
import {WebView} from 'react-native-webview';
import api42 from '../api42/api';

function AuthWebView({navigation}) {
  const onNavigationStateChange = webViewState => {
    const code = /code=([^&]*)/.exec(webViewState.url);
    const error = /error=([^&]*)/.exec(webViewState.url);

    if (code && code[1]) {
      navigation.navigate('LoginScreen', {code: code[1]});
    } else if (error) {
      navigation.navigate('LoginScreen', {error: true});
    }
  };

  return (
    <WebView
      source={{uri: api42.getAuthURL()}}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
}

export default AuthWebView;

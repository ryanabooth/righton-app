import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Auth } from 'aws-amplify';
import { StackNavigator } from 'react-navigation';
import MFAPrompt from '../../../../lib/Categories/Auth/Components/MFAPrompt';
import ButtonRound from '../../../components/ButtonRound';
import Message from '../../../components/Message';
import Constants from '../../../utils/constants';
import debug from '../../../utils/debug';
import { colors } from '../../../utils/theme';
import styles from '../SignIn/styles';

class SignUp extends React.Component {
  static navigationOptions = {
    title: Constants.APP_NAME,
  }
  constructor(props) {
    super(props);

    this.state = {
      buttonActivity: false,
      email: '',
      messageProps: null,
      password: '',
      passwordPassed: null,
      retypePassword: '',
      showActivityIndicator: false,
      showMFAPrompt: false,
    };

    this.baseState = this.state;

    this.closeActvitiyModal = this.closeActvitiyModal.bind(this);

    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);

    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.handleRetypePasswordInput = this.handleRetypePasswordInput.bind(this);
    this.handleRetypePasswordRef = this.handleRetypePasswordRef.bind(this);
    this.handleRetypePasswordSubmit = this.handleRetypePasswordSubmit.bind(this);

    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }



  async handleSignUp() {
    const { password, email } = this.state;
    let userConfirmed = true;

    this.setState({ buttonActivity: true, showActivityIndicator: true });

    debug.log('Attempting sign up w/ email & password:', email, password);


    const lowercaseEmail = email.toLowerCase();
    const username = lowercaseEmail.substr(0, lowercaseEmail.indexOf('@'));

    Auth.signUp(username, password, lowercaseEmail, null)
      .then(data => {
        userConfirmed = data.userConfirmed;

        debug.log('Sign up data received:', JSON.stringify(data));
        this.setState({ showMFAPrompt: !userConfirmed });

        if (userConfirmed) {
          this.onSignUp();
        }
      })
      .catch(exception => {
        const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
        debug.warn('Sign up exception:', JSON.stringify(exception));
        this.setState({
          buttonActivity: false,
          showActivityIndicator: false,
          messageProps: {
            closeFunc: () => this.setState({ messageProps: {} }).bind(this),
            bodyStyle: null,
            textStyle: null,
            duration: null,
            message: errorMessage,
            timeout: null,
          },
        });
        return;
      });
  }



  async handleMFAValidate(code = '') {
    const { email } = this.state;
    const lowercaseEmail = email.toLowerCase();
    const username = lowercaseEmail.substr(0, lowercaseEmail.indexOf('@'));
    try {
      await Auth.confirmSignUp(username, code)
        .then(data => debug.log('sign up successful ->', JSON.stringify(data)));
    } catch (exception) {
      const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
      this.setState({
        buttonActivity: false,
        showActivityIndicator: false,
        messageProps: {
          closeFunc: () => this.setState({ messageProps: {} }).bind(this),
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: errorMessage,
          timeout: 4000,
        },
      });
      return exception.message || exception;
    }
    return true;
  }



  handleMFACancel() {
    this.setState({ buttonActivity: false, showMFAPrompt: false, showActivityIndicator: false });
  }



  handleMFASuccess() {
    this.setState({
      showMFAPrompt: false,
      messageProps: {
        closeFunc: () => this.setState({ messageProps: {} }).bind(this),
        bodyStyle: null,
        textStyle: null,
        duration: null,
        message: 'Sign up successful',
        timeout: null,
      },
    }, () => this.onSignUp());
  }



  onSignUp() {
    this.setState(this.baseState);

    this.props.onSignUp();
  }



  handleEmailInput(email) {
    this.setState({ email });
  }



  handleEmailSubmit() {
    this.passwordRef.focus();
    Keyboard.dismiss();
  }



  handlePasswordInput(password) {
    this.setState({ password });
  }



  handlePasswordRef(ref) {
    this.passwordRef = ref;
  }



  handlePasswordSubmit() {
    this.retypePasswordRef.focus();
  }



  handleRetypePasswordInput(retypePassword) {
    this.setState({ retypePassword });
  }



  handleRetypePasswordRef(ref) {
    this.retypePasswordRef = ref;
  }



  handleRetypePasswordSubmit() {
    // TODO Check that passwords match
    Keyboard.dismiss();
  }



  closeActvitiyModal() {
    this.setState({ showActivityIndicator: false });
  }



  render() {
    const { 
      email,
      messageProps,
      password,
      retypePassword,
      showActivityIndicator,
      showMFAPrompt,
    } = this.state;

    return (
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'never'}
      >
        <Modal
          visible={showActivityIndicator}
          onRequestClose={this.closeActvitiyModal}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.italic]}>RightOn!</Text>
            <Text style={styles.title}>Teacher Setup</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your email address</Text>
            <TextInput
              keyboardType={'email-address'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handleEmailInput}
              onSubmitEditing={this.handleEmailSubmit}
              placeholder={'Email address'}
              placeholderTextColor={colors.primary}
              returnKeyType='done'
              style={styles.input}
              textAlign={'left'}
              underlineColorAndroid={colors.dark}
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              keyboardType={'default'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handlePasswordInput}
              onSubmitEditing={this.handlePasswordSubmit}
              placeholder={'Password'}
              placeholderTextColor={colors.primary} 
              ref={this.handlePasswordRef}
              returnKeyType='done'
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={password}
            />
          </View>
          <KeyboardAvoidingView
            behavior={'padding'}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Retype Password</Text>
            <TextInput
              keyboardType={'default'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handleRetypePasswordInput}
              onSubmitEditing={this.handleRetypePasswordSubmit}
              placeholder={'Retype password'}
              placeholderTextColor={colors.primary} 
              ref={this.handleRetypePasswordRef}
              returnKeyType='done'
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={retypePassword}
            />
          </KeyboardAvoidingView>
          <ButtonRound
            icon={'arrow-right'}
            onPress={this.handleSignUp}
          />
        </View>
        {
          showMFAPrompt &&
          <MFAPrompt
            onValidate={this.handleMFAValidate}
            onCancel={this.handleMFACancel}
            onSuccess={this.handleMFASuccess}
          />
        }
        { messageProps && <Message { ...messageProps } /> }
      </ScrollView>
    );
  }
}


const SignUpStack = StackNavigator({



  SignUp: {
    screen: props => <SignUp {...props} onSignUp={props.screenProps.onSignUp} />,
    navigationOptions: {
      header: null,
    }
  },



});

export default props => <SignUpStack screenProps={{ onSignUp: props.onSignUp }} />;

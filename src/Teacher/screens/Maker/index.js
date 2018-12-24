import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
// import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../../utils/theme';


class Maker extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      navigation: {
        navigate: () => {},
      },
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {

    };
  }


  renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Quiz Maker</Text>
    </View>
  );


  renderMessage = () => (
    <View style={styles.message}>
      <Aicon name={'puzzle-piece'} style={styles.messageIcon} />
      <Text style={styles.messageTeaser}>
        Access our repository of questions and student generated {'&'} tested
        distractors to include in your homework and exams. 
      </Text>
      <Text style={styles.messageDetail}>Coming soon!</Text>
    </View>
  );


  render() {
    // const {

    // } = this.state;

    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        {this.renderHeader()}
        <ScrollView
          contentContainerStyle={styles.scrollview}
        >
          {this.renderMessage()}
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    height: 200,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    marginTop: 50,
    textAlign: 'center',
  },
  message: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  messageDetail: {
    bottom: 100,
    color: colors.white,
    fontSize: fonts.large,
    position: 'absolute',
  },
  messageIcon: {
    color: colors.white,
    fontSize: 50,
    marginBottom: 75,
  },
  messageTeaser: {
    color: colors.white,
    fontSize: fonts.medium,
    textAlign: 'center',
  },
  scrollview: {
    flexGrow: 1,
  },
});


export default props => <Maker screenProps={{ ...props }} />;

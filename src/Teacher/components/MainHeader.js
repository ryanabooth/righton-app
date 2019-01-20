import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, elevation, fonts } from '../../utils/theme';


export default class MainHeader extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    parent: PropTypes.string,
  };
  
  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
    parent: '',
  };

  constructor(props) {
    super(props);

    this.handleNavigateToTeacherProfile = this.handleNavigateToTeacherProfile.bind(this);
  }


  handleNavigateToTeacherProfile() {
    const { navigation, parent } = this.props;
    navigation.navigate('TeacherProfile', parent);
  }

  
  render() {
    return (
      <View style={[styles.headerContainer, elevation]}>
        <Touchable
          activeOpacity={0.8}
          onPress={this.handleNavigateToTeacherProfile}
          style={styles.headerProfileContainer}
        >
          <Aicon name={'user'} style={styles.headerProfileIcon} />
        </Touchable>
        <Text style={styles.headerTitle}>RightOn!</Text>
        <Touchable
          activeOpacity={0.8}
          onPress={() => { /* TODO */ }}
        >
          <Aicon name={'search'} style={styles.headerSearchIcon} />
        </Touchable>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderColor: colors.dark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: '65@vs',
    justifyContent: 'space-between',
    paddingHorizontal: '15@s',
  },
  headerProfileContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 100,
    height: '40@ms',
    justifyContent: 'flex-end',
    width: '40@ms',
  },
  headerProfileIcon: {
    color: colors.dark,
    fontSize: '30@ms0.2',
    marginTop: '3@vs',
  },
  headerSearchIcon: {
    color: colors.white,
    fontSize: '28@ms0.2',
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    fontStyle: 'italic',
  },
});

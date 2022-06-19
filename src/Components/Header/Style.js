import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: '#49ABD4',
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    height: 85,
    width: 85,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 3,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
});

export default styles;

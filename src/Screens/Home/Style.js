import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saldo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    borderStartColor: '#49ABD4',
    borderStartWidth: 5,
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 20,
  },
  number: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#494949',
  },
  gerenciar: {
    width: 277,
    height: 51,
    backgroundColor: '#49ABD4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default styles;

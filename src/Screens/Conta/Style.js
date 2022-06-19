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
  botao: {
    width: 277,
    height: 51,
    backgroundColor: '#f54a11',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 30,
  },
  txtNormal: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  txtRegistrar: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ed5624',
  },
  titulo: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 5,
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  form: {
    alignItems: 'center',
    marginTop: 100,
  },
  inputRegistrar: {
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputEntrar: {
    backgroundColor: '#ed5624',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  list: {
    height: 400,
    width: '80%',
  },
  dropdown: {
    marginVertical: 20,
  },
});

export default styles;

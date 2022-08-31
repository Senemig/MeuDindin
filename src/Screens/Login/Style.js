import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#49ABD4',
    height: '100%',
  },
  Image: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 5,
    textAlign: 'center',
    color: '#fff',
  },
  form: {
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 30,
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
  inputFoto: {
    backgroundColor: '#005624',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  inputRegistrar: {
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
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
});

export default styles;

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#535353',
  },
  saldo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E98CC',
  },
  positivo: {
    color: '#6ACC1E',
  },
  negativo: {
    color: '#CC331E',
  },
});

export default styles;

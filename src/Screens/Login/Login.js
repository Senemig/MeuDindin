import {View, TouchableOpacity, Modal, Alert} from 'react-native';
import {
  NativeBaseProvider,
  Text,
  Box,
  Heading,
  Input,
  Icon,
  MaterialIcons,
  Button,
} from 'native-base';
import styles from './Style';
import React, {useState, useEffect} from 'react';

import {openDatabase} from 'react-native-sqlite-storage';
import {NavigationContainer} from '@react-navigation/native';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Login = ({navigation, route}) => {
  const [user, setUser] = useState('');
  const [psw, setPsw] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      console.log('Tentando abrir tabela Usuarios');
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Usuarios'",
        [],
        (tx, result) => {
          if (result.rows.length == 0) {
            console.log('Criando tabela Usuarios');
            tx.executeSql('DROP TABLE IF EXISTS Usuarios', []);
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30), senha VARCHAR(30), saldo DOUBLE, foto TEXT)',
              [],
            );
          }
        },
      );
    });
  }, []);

  function login() {
    if (user == '' || psw == '') {
      Alert.alert('Login inválido!', 'Você deve preencher todos os campos!');
    } else {
      db.transaction(tx => {
        console.log('Procurando usuário ' + user + ' senha ' + psw);
        tx.executeSql(
          'SELECT * FROM Usuarios WHERE nome = ? AND senha = ?',
          [user, psw],
          (tx, result) => {
            if (result.rows.length > 0) {
              navigation.navigate('Home', {
                nome: result.rows.item(0).nome,
                id: result.rows.item(0).id,
                saldo: result.rows.item(0).saldo,
                foto: result.rows.item(0).foto,
              });
            } else {
              Alert.alert(
                'Login inválido!',
                'Usuário e senha não encontrados!',
              );
            }
          },
        );
      });
    }
  }

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="primary.500" py={5}>
        <Heading
          size={'4xl'}
          fontSize={'70'}
          textAlign={'center'}
          color={'warning.500'}
          fontWeight={'extrabold'}>
          Login
        </Heading>
        <Box alignItems={'center'} my={10}>
          <Input
            w={{
              base: '75%',
              md: '25%',
            }}
            bg={'primary.100'}
            variant={'rounded'}
            mb={5}
            fontSize={20}
            placeholder="Usuário"
            value={user}
            onChangeText={txt => setUser(txt)}
            _focus={{bg: 'primary.100'}}
          />
          <Input
            w={{
              base: '75%',
              md: '25%',
            }}
            bg={'primary.100'}
            fontSize={20}
            variant={'rounded'}
            placeholder="Senha"
            type="password"
            value={psw}
            onChangeText={txt => setPsw(txt)}
            _focus={{bg: 'primary.100'}}
          />
          <Button
            rounded={20}
            size={'lg'}
            w={40}
            mt={10}
            bg={'warning.600'}
            onPress={() => {
              login();
            }}
            _text={{
              fontSize: 24,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            Entrar
          </Button>
          <Button
            variant={'link'}
            size={'lg'}
            w={40}
            mt={5}
            onPress={() => {
              navigation.navigate('Registrar');
            }}
            _text={{
              fontSize: 24,
              fontWeight: 'extrabold',
              textTransform: 'uppercase',
              color: 'warning.600',
            }}>
            Registrar
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default Login;

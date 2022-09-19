import {Image, Alert} from 'react-native';
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
import React, {useState, useEffect} from 'react';
import styles from '../Login/Style';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Registrar = ({navigation, route}) => {
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

  function registrar() {
    if (user == '' || psw == '') {
      Alert.alert('Registro inválido!', 'Você deve preencher todos os campos!');
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Usuarios WHERE nome = ?',
          [user],
          (tx, result) => {
            if (result.rows.length > 0) {
              Alert.alert(
                'Erro no cadastro!',
                'Usuário ' + user + ' já tem cadastro!',
              );
            } else {
              db.transaction(tx => {
                tx.executeSql(
                  'INSERT INTO Usuarios (nome, senha, saldo, foto) VALUES (?, ?, ?, ?)',
                  [user, psw, parseFloat(0), route.params.foto],
                  (tx, result) => {
                    console.log('Results', result.rowsAffected);
                    if (result.rowsAffected > 0) {
                      Alert.alert(
                        'Registro concluído!',
                        'Usuário ' + user + ' registrado com sucesso!',
                      );
                      navigation.goBack();
                    }
                  },
                );
              });
            }
          },
        );
      });
    }
  }

  return (
    <NativeBaseProvider>
      <Box flex={1} alignItems={'center'} bg="primary.500">
        <Heading
          mb={5}
          size={'xl'}
          fontSize={'60'}
          textAlign={'center'}
          color={'warning.500'}
          fontWeight={'extrabold'}>
          Cadastro
        </Heading>
        <Box alignItems={'center'}>
          <Image source={{uri: route.params.foto}} style={styles.Image} />
          <Button
            onPress={() => navigation.navigate('Camera')}
            rounded={20}
            size={'md'}
            bg={'warning.600'}
            _text={{
              fontSize: 18,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            Tirar Foto
          </Button>
          <Input
            w={{
              base: '75%',
              md: '25%',
            }}
            bg={'primary.100'}
            mt={5}
            fontSize={20}
            variant={'rounded'}
            placeholder="Nome"
            value={user}
            _focus={{bg: 'primary.100'}}
            onChangeText={txt => setUser(txt.trim())}
          />
          <Input
            w={{
              base: '75%',
              md: '25%',
            }}
            bg={'primary.100'}
            mt={5}
            fontSize={20}
            variant={'rounded'}
            placeholder="Senha"
            type="password"
            value={psw}
            _focus={{bg: 'primary.100'}}
            onChangeText={txt => setPsw(txt.trim())}
          />
          <Button
            mt={5}
            rounded={20}
            size={'md'}
            bg={'warning.600'}
            _text={{
              fontSize: 18,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
            onPress={() => {
              registrar();
            }}>
            Cadastrar
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default Registrar;

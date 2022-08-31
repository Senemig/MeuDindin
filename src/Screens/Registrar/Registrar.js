import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>
      <View style={styles.form}>
        <Image source={{uri: route.params.foto}} style={styles.Image} />
        <TouchableOpacity
          style={styles.inputFoto}
          onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.txtNormal}>Tirar Foto</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Usuário"
          style={styles.input}
          onChangeText={txt => setUser(txt.trim())}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          onChangeText={txt => setPsw(txt.trim())}
        />
        <TouchableOpacity
          style={styles.inputEntrar}
          onPress={() => {
            registrar();
          }}>
          <Text style={styles.txtNormal}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registrar;

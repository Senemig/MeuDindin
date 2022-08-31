import {View, Text, TextInput, TouchableOpacity, Modal} from 'react-native';
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
    <View style={styles.container}>
      {/* Modal para registrar novo usuário */}
      {/* <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setUser('');
          setPsw('');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Cadastro</Text>
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.inputEntrar}
              onPress={() => navigation.navigate('Camera')}>
              <Text style={styles.txtNormal}>Cadastrar</Text>
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
      </Modal> */}
      {/* ********************************************** */}
      <Text style={styles.titulo}>Login</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Usuário"
          style={styles.input}
          value={user}
          onChangeText={txt => setUser(txt)}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={psw}
          onChangeText={txt => setPsw(txt)}
        />
        <TouchableOpacity
          style={styles.inputEntrar}
          onPress={() => {
            login();
          }}>
          <Text style={styles.txtNormal}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputRegistrar}
          onPress={() => {
            navigation.navigate('Registrar');
          }}>
          <Text style={styles.txtRegistrar}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

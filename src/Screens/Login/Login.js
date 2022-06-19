import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import styles from './Style';
import React, {useState, useEffect} from 'react';

import {openDatabase} from 'react-native-sqlite-storage';
import {NavigationContainer} from '@react-navigation/native';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Login = ({navigation}) => {
  const [user, setUser] = useState('');
  const [psw, setPsw] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
              'CREATE TABLE IF NOT EXISTS Usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30), senha VARCHAR(30), saldo DOUBLE)',
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
                  'INSERT INTO Usuarios (nome, senha, saldo) VALUES (?, ?, ?)',
                  [user, psw, parseFloat(0)],
                  (tx, result) => {
                    console.log('Results', result.rowsAffected);
                    if (result.rowsAffected > 0) {
                      Alert.alert(
                        'Registro concluído!',
                        'Usuário ' + user + ' registrado com sucesso!',
                      );
                      setUser('');
                      setPsw('');
                      setModalVisible(false);
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
      {/* Modal para registrar novo usuário */}
      <Modal
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
      </Modal>
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
            setModalVisible(true);
          }}>
          <Text style={styles.txtRegistrar}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

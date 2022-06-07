import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import styles from './Style';
import React, {useState} from 'react';

const Login = () => {
  const [user, setUser] = useState('');
  const [psw, setPsw] = useState('');

  function login() {
    if (user == '' || psw == '') {
      Alert.alert('Login inválido!', 'Você deve preencher todos os campos!');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Usuário"
          style={styles.input}
          onChangeText={txt => setUser(txt)}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          onChangeText={txt => setPsw(txt)}
        />
        <TouchableOpacity
          style={styles.inputEntrar}
          onPress={() => {
            login();
          }}>
          <Text style={styles.txtNormal}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputRegistrar}>
          <Text style={[styles.txtNormal, {color: '#ed5624'}]}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

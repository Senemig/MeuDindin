import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import styles from './Style';

import {openDatabase} from 'react-native-sqlite-storage';
import Header from '../../Components/Header/Header';
import Card from '../../Components/Card/Card';
import Icon from 'react-native-vector-icons/Ionicons';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Home = ({route, navigation}) => {
  const [somaDinheiro, setSomaDinheiro] = useState(0);
  const [contas, setContas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeConta, setNomeConta] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [foto, setFoto] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    // db.transaction(tx => {
    //   tx.executeSql(
    //     'SELECT * FROM Usuarios WHERE id = ?',
    //     [route.params.id],
    //     (tx, result) => {
    //       if (result.rows.length > 0) {
    //         console.log('saldo ' + result.rows.item(0).saldo);
    //         setSomaDinheiro(result.rows.item(0).saldo);
    //         console.log('somaDinheiro ' + somaDinheiro);
    //       }
    //     },
    //   );
    // });
    console.log('Procurando tabela Contas');
    db.transaction(tx => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Contas'",
        [],
        (tx, result) => {
          if (result.rows.length == 0) {
            console.log('Tabela Contas não existe');
            tx.executeSql('DROP TABLE IF EXISTS Contas', []);
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Contas(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30), saldo DOUBLE, user INTEGER)',
              [],
              () => {},
              error => {
                console.log('Erro ao criar a tabela Contas\n' + error.message);
              },
            );
          } else {
            console.log('Tabela Contas existe');
            tx.executeSql(
              'SELECT * FROM Contas WHERE user = ?',
              [route.params.id],
              (tx, result) => {
                console.log(result.rows.length);
                if (result.rows.length > 0) {
                  var temp = [];
                  var soma = 0;
                  for (let i = 0; i < result.rows.length; ++i) {
                    console.log(somaDinheiro);
                    console.log(result.rows.item(i).saldo);
                    temp.push(result.rows.item(i));
                    soma += result.rows.item(i).saldo;
                    console.log(soma);
                    setSomaDinheiro(soma);
                  }
                  console.log(temp.length);
                  setContas(temp);
                }
              },
              error => {
                console.log('Error ao listar as contas\n' + error.message);
              },
            );
          }
        },
        error =>
          console.log('Erro ao procurar a tabela contas\n' + error.message),
      );
    });
  }, [modalVisible, isFocused]);

  function registrar() {
    if (nomeConta == '') {
      Alert.alert('Conta inválida!', 'Preencha todos os campos!');
    } else {
      console.log('Procurando conta ' + nomeConta);
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Contas WHERE nome = ?',
          [nomeConta],
          (tx, result) => {
            if (result.rows.length > 0) {
              Alert.alert(
                'Conta inválida!',
                'Conta ' + nomeConta + ' já cadastrada!',
              );
            } else {
              console.log(
                'Criando conta ' +
                  nomeConta +
                  ' para usuário ' +
                  route.params.id,
              );
              tx.executeSql(
                'INSERT INTO Contas (nome, saldo, user) VALUES (?, ?, ?)',
                [nomeConta, parseFloat(0), route.params.id],
                (tx, result) => {
                  if (result.rowsAffected > 0) {
                    // Alert.alert(
                    //   'Conta cadastrada!',
                    //   'Conta ' + nomeConta + ' cadastrada com sucesso!',
                    // );
                    setNomeConta('');
                    setModalVisible(false);
                  } else {
                    Alert.alert(
                      'Erro!',
                      'Não foi possível criar a conta ' +
                        nomeConta +
                        ' com valor ' +
                        0 +
                        ' e id de usuário ' +
                        route.params.id,
                    );
                  }
                },
              );
              tx.executeSql('UPDATE Usuarios SET saldo = ? WHERE id = ?', [
                parseFloat(somaDinheiro) + parseFloat(saldo),
                route.params.id,
              ]);
            }
          },
          error => {
            console.log('Erro ao procurar conta ' + nomeConta + error);
          },
        );
      });
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header
          msg={'Olá, ' + route.params.nome + '!'}
          foto={route.params.foto}
        />
        <View style={styles.saldo}>
          <View style={{justifyContent: 'space-evenly'}}>
            <Text>Saldo Total</Text>
            <Text style={styles.number}>R$ {somaDinheiro.toFixed(2)}</Text>
          </View>
          <Icon name="eye-off-outline" size={50} color="#B0B0B0" />
        </View>
        <FlatList
          style={styles.list}
          data={contas}
          renderItem={({item}) => (
            <Card
              nome={item.nome}
              saldo={item.saldo}
              onPress={() => {
                navigation.navigate('Conta', {
                  userId: route.params.id,
                  conta: item.nome,
                  nome: route.params.nome,
                  saldo: item.saldo,
                  saldoUser: somaDinheiro,
                });
              }}
            />
          )}
        />
        <TouchableOpacity
          style={styles.gerenciar}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.text}>Gerenciar Contas</Text>
        </TouchableOpacity>
      </View>
      {/* Modal para registrar novo usuário */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{backgroundColor: '#49ABD4', height: '100%'}}>
          <Text style={styles.titulo}>Criar Conta</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Conta"
              style={styles.input}
              onChangeText={txt => setNomeConta(txt.trim())}
            />
            <TouchableOpacity
              style={styles.inputEntrar}
              onPress={() => {
                registrar();
              }}>
              <Text style={styles.txtNormal}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ********************************************** */}
    </SafeAreaView>
  );
};

export default Home;

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

import styles from './Style';
import Header from '../../Components/Header/Header';
import Card from '../../Components/Card/Card';
import Icon from 'react-native-vector-icons/Ionicons';
import {openDatabase} from 'react-native-sqlite-storage';
import SelectDropdown from 'react-native-select-dropdown';
import {parse} from '@babel/core';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Conta = ({route, navigation}) => {
  const [conta, setConta] = useState(route.params.conta);
  const [saldo, setSaldo] = useState(parseFloat(route.params.saldo));
  const [userId, setUserId] = useState(route.params.userId);
  const [nome, setNome] = useState();
  const [valor, setValor] = useState(0);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipo, setTipo] = useState(0);
  const [update, setUpdate] = useState(false);

  const tipos = ['Entrada', 'Saída'];

  useEffect(() => {
    console.log('saldo do usuario ' + route.params.saldoUser);
    db.transaction(tx => {
      console.log('Tentando abrir tabela Historico');
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Historico'",
        [],
        (tx, result) => {
          if (result.rows.length == 0) {
            console.log('Criando tabela Historico');
            tx.executeSql('DROP TABLE IF EXISTS Historico', []);
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Historico(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30), conta VARCHAR(30), tipo INTEGER, valor DOUBLE, userId INTEGER)',
              [],
            );
          } else {
            console.log('Tabela Historico existe');
            tx.executeSql(
              'SELECT * FROM Historico WHERE userId = ? AND conta = ?',
              [route.params.userId, route.params.conta],
              (tx, result) => {
                console.log(result.rows.length);
                if (result.rows.length > 0) {
                  var temp = [];
                  var soma = 0;
                  for (let i = 0; i < result.rows.length; ++i) {
                    temp.push(result.rows.item(i));
                    if (result.rows.item(i).tipo == 0) {
                      soma += result.rows.item(i).valor;
                    } else {
                      soma -= result.rows.item(i).valor;
                    }
                  }
                  console.log(temp.length);
                  setData(temp);
                  setSaldo(soma);
                }
              },
              error => {
                console.log(
                  'Error ao listar os lançamentos!\n' + error.message,
                );
              },
            );
          }
        },
      );
    });
  }, [modalVisible, update]);

  function registrar() {
    if (nome == '' || valor == '') {
      Alert.alert('Conta inválida!', 'Preencha todos os campos!');
    } else {
      db.transaction(tx => {
        console.log('Inserindo valor ' + valor + ' do tipo ' + tipo);
        tx.executeSql(
          'INSERT INTO Historico (nome, conta, tipo, valor, userId) VALUES (?, ?, ?, ?, ?)',
          [nome, conta, tipo, valor, userId],
          () => {
            alterarSaldo();
            setModalVisible(false);
            // setUpdate(!update);
          },
          error => {
            console.log(error.message);
          },
        );
      });
    }
  }

  function alterarSaldo() {
    let temp = parseFloat(saldo) + parseFloat(valor);
    db.transaction(tx => {
      console.log('alterando saldo para ' + temp);
      tx.executeSql(
        'UPDATE Contas SET saldo = ? WHERE nome = ? AND user = ?',
        [parseFloat(temp), conta, userId],
        () => {},
        error => {
          console.log(error.message);
        },
      );
    });
  }

  function remover(id) {
    console.log('tentando remover item ' + id);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Historico WHERE id = ?',
        [id],
        () => {
          setUpdate(!update);
        },
        error => {
          setUpdate(!update);
        },
      );
    });
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header msg={conta} />
        <View style={styles.saldo}>
          <View style={{justifyContent: 'space-evenly'}}>
            <Text>Saldo Total</Text>
            <Text style={styles.number}>R$ {saldo.toFixed(2)}</Text>
          </View>
          <Icon name="eye-off-outline" size={50} color="#B0B0B0" />
        </View>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={({item}) => (
            <Card
              nome={item.nome}
              saldo={item.valor}
              tipo={item.tipo}
              // onPress={() => {
              //   remover(item.id);
              // }}
            />
          )}
        />
        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.text}>Novo Lançamento</Text>
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
          <Text style={styles.titulo}>Novo Lançamento</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Nome"
              style={styles.input}
              onChangeText={txt => setNome(txt.trim())}
            />
            <SelectDropdown
              buttonStyle={styles.dropdown}
              data={tipos}
              onSelect={(selectedItem, index) => {
                setTipo(index);
              }}
              defaultValueByIndex={0}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
            <TextInput
              placeholder="Valor"
              keyboardType="decimal-pad"
              style={styles.input}
              onChangeText={txt => setValor(txt)}
            />
            <TouchableOpacity
              style={styles.inputEntrar}
              onPress={() => {
                registrar();
              }}>
              <Text style={styles.txtNormal}>Lançar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ********************************************** */}
    </SafeAreaView>
  );
};

export default Conta;

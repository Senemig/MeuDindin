import {FlatList, SafeAreaView, Modal, Alert} from 'react-native';
import {
  NativeBaseProvider,
  Text,
  Box,
  Heading,
  Input,
  MaterialIcons,
  Button,
} from 'native-base';
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
    <NativeBaseProvider>
      <SafeAreaView>
        <Box alignItems={'center'}>
          <Header
            msg={'Olá, ' + route.params.nome + '!'}
            foto={route.params.foto}
          />
          <Box
            py={1}
            px={1}
            mt={5}
            w={'80%'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flexDirection={'row'}
            borderLeftColor={'primary.700'}
            borderLeftWidth={3}>
            <Box>
              <Text fontWeight={'bold'} color={'muted.500'} letterSpacing={1}>
                Saldo Total
              </Text>
              <Text fontSize={30} fontWeight={'bold'} color={'muted.600'}>
                R$ {somaDinheiro.toFixed(2)}
              </Text>
            </Box>
            <Icon name="eye-off-outline" size={50} color="#B0B0B0" />
          </Box>
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
          <Button
            rounded={20}
            size={'lg'}
            mt={10}
            bg={'warning.600'}
            _text={{
              fontSize: 18,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
            onPress={() => {
              setModalVisible(true);
            }}>
            Gerenciar Contas
          </Button>
        </Box>
        {/* Modal para registrar novo usuário */}
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Box flex={1} alignItems={'center'} bg="primary.500">
            <Heading
              mb={5}
              size={'xl'}
              fontSize={'60'}
              textAlign={'center'}
              color={'warning.500'}
              fontWeight={'extrabold'}>
              Criar Conta
            </Heading>
            <Box>
              <Input
                value={nomeConta}
                w={{
                  base: '75%',
                  md: '25%',
                }}
                bg={'primary.100'}
                mt={5}
                fontSize={20}
                variant={'rounded'}
                _focus={{bg: 'primary.100'}}
                placeholder="Conta"
                onChangeText={txt => setNomeConta(txt.trim())}
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
                Criar
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* ********************************************** */}
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default Home;

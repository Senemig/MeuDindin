import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from './Style';

import {openDatabase} from 'react-native-sqlite-storage';
import Header from '../../Components/Header/Header';
import Icon from 'react-native-vector-icons/Ionicons';

var db = openDatabase({
  name: 'dbMeuDindin.db',
  location: 'default',
});

const Home = ({route, navigation}) => {
  const [somaDinheiro, setSomaDinheiro] = useState(0.0);

  return (
    <View style={styles.container}>
      <Header nome={'Fernando'} />
      <View style={styles.saldo}>
        <View style={{justifyContent: 'space-evenly'}}>
          <Text>Saldo Total</Text>
          <Text style={styles.number}>R$ {somaDinheiro.toFixed(2)}</Text>
        </View>
        <Icon name="eye-off-outline" size={50} color="#B0B0B0" />
      </View>
      <TouchableOpacity style={styles.gerenciar}>
        <Text style={styles.text}>Gerenciar Contas</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

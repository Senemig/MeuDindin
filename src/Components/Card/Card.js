import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './Style';

const Card = props => {
  console.log('tipo ' + props.tipo);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={props.onPress}>
        <Text style={styles.nome}>{props.nome}</Text>
        {props.tipo != undefined ? (
          <Text
            style={[
              styles.saldo,
              props.tipo == 0 ? styles.positivo : styles.negativo,
            ]}>
            R$ {props.saldo.toFixed(2)}
          </Text>
        ) : (
          <Text
            style={[
              styles.saldo,
              props.saldo >= 0 ? styles.positivo : styles.negativo,
            ]}>
            R$ {props.saldo.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Card;

import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../Components/Header/Style';

const Header = props => {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: 'https://picsum.photos/85/85'}}
        />
        <Text style={styles.text}>{props.msg}</Text>
    </View>
  );
};

export default Header;

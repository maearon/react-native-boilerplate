import { useAuthStore } from '@/stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

export default function Menu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { loggedIn, logout, user } = useAuthStore();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    onClose();
    navigation.navigate('index' as never);
  };

  const handleNavigate = (path: string, params: any) => {
    onClose()
    router.push({ pathname: path as never, params });
  }

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.menuContainer}>
        {loggedIn ? (
          <>
            <Pressable onPress={() => handleNavigate('/UserProfile', { id: user?.id })}>
              <Text style={styles.item}>👤 Profile</Text>
            </Pressable>
            <Pressable onPress={() => handleNavigate('/UserSettings', { id: user?.id })}>
              <Text style={styles.item}>⚙️ Settings</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text style={[styles.item, { color: 'red' }]}>📤 Log out</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={() => handleNavigate('/Login', {})}>
            <Text style={styles.item}>🔑 Log in</Text>
          </Pressable>
        )}

        <Pressable onPress={onClose}>
          <Text style={styles.close}>⬅️ Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  item: {
    fontSize: 18,
    marginVertical: 12,
  },
  close: {
    marginTop: 32,
    fontSize: 16,
    color: 'blue',
  },
});

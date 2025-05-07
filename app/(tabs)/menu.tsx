import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

export default function Menu() {
  const [isVisible, setIsVisible] = useState(true); // Hiện menu ngay khi vào tab

  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={isVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={() => setIsVisible(false)}
        style={styles.modal}
      >
        <RightMenu onClose={() => setIsVisible(false)} />
      </Modal>
    </View>
  );
}

function RightMenu({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.item}>👤 Profile</Text>
      <Text style={styles.item}>⚙️ Settings</Text>
      <Text style={styles.item}>📤 Log out</Text>

      <Pressable onPress={onClose}>
        <Text style={styles.close}>⬅️ Close</Text>
      </Pressable>
    </View>
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

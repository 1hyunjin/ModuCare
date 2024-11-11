import React, {createContext, useContext, useState} from 'react';
import {Modal, StyleSheet, Dimensions, Pressable, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import CustomButton from './CustomButton';
import CustomText from './CustomText';

// Context 생성
interface AlertContextType {
  showAlert: (message: string) => void;
  closeAlert: () => void;
}

interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const HEIGHT = Dimensions.get('window').height;
// Provider 컴포넌트
export function AlertProvider({children}: {children: React.ReactNode}) {
  const [alertModal, setAlertModal] = useState({
    visible: false,
    message: '',
  });

  const showAlert = (message: string) => {
    setAlertModal({
      visible: true,
      message,
    });
  };

  const closeAlert = () => {
    setAlertModal({
      visible: false,
      message: '',
    });
  };

  return (
    <AlertContext.Provider value={{showAlert, closeAlert}}>
      {children}
      <PopupModal visible={alertModal.visible} onClose={closeAlert}>
        <View style={styles.alertContainer}>
          <CustomText label={alertModal.message} size={16} />
          <CustomButton
            label="확인"
            variant="filled"
            size="small"
            onPress={closeAlert}
          />
        </View>
      </PopupModal>
    </AlertContext.Provider>
  );
}

// 커스텀 훅
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export default function PopupModal({
  visible,
  onClose,
  children,
}: PopupModalProps) {
  return (
    <View style={styles.overlay}>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <GestureRecognizer onSwipeDown={onClose}>
          <Pressable
            style={styles.modalContainer}
            onPress={e => e.stopPropagation()}>
            {children}
          </Pressable>
        </GestureRecognizer>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    paddingBottom: 30,
  },
  alertContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
});

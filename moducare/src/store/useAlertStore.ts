import {create} from 'zustand';

type AlertStore = {
  visible: boolean;
  message: string;

  setVisible: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const useAlertStore = create<AlertStore>(set => ({
  visible: false,
  message: '',

  setVisible: value => set({visible: value}),
  setMessage: value => set({message: value}),
}));

export default useAlertStore;

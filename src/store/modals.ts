import { create } from "zustand";

interface IModals {
  contactsModal: boolean;
  drawer: boolean;
  addContactModal: boolean;
}

export const useModals = create<IModals>(() => ({
  contactsModal: false,
  drawer: false,
  addContactModal: false
}));

export const toggleContactsModal = () => {
  useModals.setState((state) => ({
    ...state,
    contactsModal: !state.contactsModal
  }));
};

export const toggleDrawer = () => {
  useModals.setState((state) => ({
    ...state,
    drawer: !state.drawer
  }));
};

export const toggleAddContactModal = () => {
  useModals.setState((state) => ({
    ...state,
    addContactModal: !state.addContactModal
  }));
};

export const closeAllModals = () => {
  useModals.setState((state) => {
    const newState = {} as {[key: string]: boolean};
    Object.keys(state).forEach((key) => {
      newState[key] = false;
    });
    return newState; 
  });
};

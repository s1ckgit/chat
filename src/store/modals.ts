import { create } from "zustand";

interface IModals {
  contactsModal: boolean;
  drawer: boolean;
  addContactModal: boolean;
  attachFileModal: {
    isOpened: boolean;
    imagesSrc: string[];
    filesToSend: File[];
  };
}

export const useModals = create<IModals>(() => ({
  contactsModal: false,
  drawer: false,
  addContactModal: false,
  attachFileModal: {
    isOpened: false,
    imagesSrc: [],
    filesToSend: []
  }
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

export const toggleAttchFileModal = () => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      isOpened: !state.attachFileModal.isOpened,
      imagesSrc: !state.attachFileModal.isOpened ? state.attachFileModal.imagesSrc : [],
      filesToSend: !state.attachFileModal.isOpened ? state.attachFileModal.filesToSend : []
    }
  }));
};

export const addImagesSrc = (urls: string[]) => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      ...state.attachFileModal,
      isOpened: state.attachFileModal.isOpened,
      imagesSrc: [
        ...state.attachFileModal.imagesSrc,
        ...urls
      ]
    }
  }));
};

export const addFilesToSend = (files: File[]) => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      ...state.attachFileModal,
      filesToSend: [
        ...state.attachFileModal.filesToSend,
        ...files
      ]
    }
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

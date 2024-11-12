import { create } from "zustand";

interface IModals {
  contactsModal: boolean;
  drawer: boolean;
  addContactModal: boolean;
  attachFileModal: {
    isOpened: boolean;
    attachments: any[];
  };
}

export const useModals = create<IModals>(() => ({
  contactsModal: false,
  drawer: false,
  addContactModal: false,
  attachFileModal: {
    isOpened: false,
    attachments: []
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

export const toggleAttchFileModal = (ref: React.RefObject<HTMLInputElement>) => {
  if(ref.current) {
    ref.current.value = '';
  }
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      isOpened: !state.attachFileModal.isOpened,
      attachments: !state.attachFileModal.isOpened ? state.attachFileModal.attachments : []
    }
  }));
};

export const setAttachments = (attachments: any[]) => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      ...state.attachFileModal,
      attachments: [
        ...state.attachFileModal.attachments,
        ...attachments
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

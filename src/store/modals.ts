import { create } from "zustand";

interface IModals {
  contactsModal: boolean;
  drawer: boolean;
  addContactModal: boolean;
  attachFileModal: {
    isOpened: boolean;
    fileInputRef: React.RefObject<HTMLInputElement> | null;
    attachments: any[];
  };
  imageModal: {
    isOpened: boolean;
    imageSrc: string;
  }
}

export const useModals = create<IModals>(() => ({
  contactsModal: false,
  drawer: false,
  addContactModal: false,
  attachFileModal: {
    isOpened: false,
    fileInputRef: null,
    attachments: []
  },
  imageModal: {
    isOpened: false,
    imageSrc: ''
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
  useModals.setState((state) => {
    if(state.attachFileModal.fileInputRef?.current) {
      state.attachFileModal.fileInputRef.current.value = '';
    }
    return {
      ...state,
      attachFileModal: {
        fileInputRef: state.attachFileModal.fileInputRef,
        isOpened: !state.attachFileModal.isOpened,
        attachments: !state.attachFileModal.isOpened ? state.attachFileModal.attachments : []
      }
    };
  });
};

export const toggleImageModal = () => {
  useModals.setState((state) => {
    return {
      ...state,
      imageModal: {
        ...state.imageModal,
        isOpened: !state.imageModal.isOpened
      }
    };
  });
};

export const setImageModalSrc = (src: string) => {
  useModals.setState((state) => {
    return {
      ...state,
      imageModal: {
        ...state.imageModal,
        imageSrc: src
      }
    };
  });
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

export const removeAttachment = (id: number) => {
  useModals.setState((state) => {
    return {
      ...state,
      attachFileModal: {
        ...state.attachFileModal,
        attachments: state.attachFileModal.attachments.filter((attach) => attach.id !== id)
      }
    };
  });
};

export const setFileInputRef = (ref: React.RefObject<HTMLInputElement>) => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      ...state.attachFileModal,
      fileInputRef: ref
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

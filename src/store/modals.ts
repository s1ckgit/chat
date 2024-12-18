import { create } from "zustand";
import type { IClientMessageAttachments } from "../types";

interface IModals {
  contactsModal: boolean;
  drawer: boolean;
  addContactModal: boolean;
  attachFileModal: {
    isOpened: boolean;
    fileInputRef: React.RefObject<HTMLInputElement> | null;
    attachments: IClientMessageAttachments[];
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
    contactsModal: !state.contactsModal,
  }));
};

export const toggleDrawer = () => {
  useModals.setState((state) => ({
    ...state,
    drawer: !state.drawer
  }));
};


export const openAddContactModal = () => {
  useModals.setState((state) => ({
    ...state,
    addContactModal: true
  }));
};


export const closeAddContactModal = () => {
  useModals.setState((state) => ({
    ...state,
    addContactModal: false
  }));
};

export const toggleAttachFileModal = () => {
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

export const setAttachments = (attachments: IClientMessageAttachments[]) => {
  useModals.setState((state) => ({
    ...state,
    attachFileModal: {
      ...state.attachFileModal,
      attachments: [
        ...state.attachFileModal.attachments!,
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
    const updatedState = Object.entries(state).reduce((acc, [key, value]) => {
      const modalKey = key as keyof IModals;

      if (typeof value === 'boolean') {
        value = false;
        acc[modalKey] = value;
      } else if (typeof value === 'object' && value !== null && 'isOpened' in value) {
        acc[modalKey] = { ...value, isOpened: false };
      } else {
        acc[modalKey] = value;
      }
      return acc;
    }, {} as IModals);

    return updatedState;
  });
};

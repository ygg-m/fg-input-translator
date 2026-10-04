import { createContext, useContext, useState } from "react";
import { texts } from "../data";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState(texts[0]);
  const [showModal, setShowModal] = useState();

  const value = {
    modalData,
    setModalData,
    showModal,
    setShowModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

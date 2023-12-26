import React from "react";
import Modal from "react-modal";

const CustomModal = ({
  modalIsOpen,
  setModalIsOpen,
  children,
  width,
  height,
}: any) => {
  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      contentLabel="Example Modal"
      style={{
        overlay: {
          backgroundColor: "transparent",
          backdropFilter: "blur(8px) brightness(110%)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          width: width || "44%",
          height: height || "46%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#24282E",
          borderWidth: 0,
          backdropFilter: "drop-shadow(10px 10px 10px black)",
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;

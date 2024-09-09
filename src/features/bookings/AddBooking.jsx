import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import { useState } from "react";
import NewBookingForm from "./NewBookingsForm";

function AddBooking() {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Modal.Open opens="booking-form" onClick={openModal}>
          <Button>Add new Booking</Button>
        </Modal.Open>
        <Modal.Window name="booking-form">
          <NewBookingForm closeModal={closeModal} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddBooking;

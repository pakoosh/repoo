// Modal.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const Modal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Welcome to the Sites Monitoring Portal!</DialogTitle>
      <DialogContent>
        <p>You must click OK to enter the app.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;

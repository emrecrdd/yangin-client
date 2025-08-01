// components/admin/ConfirmDeleteDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Silme İşlemini Onaylayın',
  content = 'Bu sensörü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;

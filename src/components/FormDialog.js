import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box
} from "@mui/material";

const FormDialog = (props) => {
  const { open, title, contentText, onSubmit, onClose, fields, enableCancel, cancelText, submitText } = props;

  return (
    <Dialog
      component="form"
      method="post"
      onSubmit={onSubmit}
      open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {contentText}
        </DialogContentText>
        {fields.map((field, index) => {
          return <TextField
            key={field.id}
            margin="dense"
            id={field.id}
            label={field.label}
            type={field.type}
            required={field.required}
            fullWidth
            variant="standard"
          />
        })}
      </DialogContent>
      <DialogActions>
        {enableCancel ?? <Button onClick={onClose}>{cancelText}</Button>}
        <Button type="submit">{submitText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
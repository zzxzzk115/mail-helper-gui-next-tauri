import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeIcon from "@mui/icons-material/Home";
import AttachmentIcon from '@mui/icons-material/Attachment';
import FolderIcon from '@mui/icons-material/Folder';
import HtmlIcon from '@mui/icons-material/Html';
import { useState } from "react";

const HomeEmailAction = (props) => {

  const [expandedState, setExpandedState] = useState({
    "sender": true,
    "recipient": true,
    "email": true,
  });
  const [open, setOpen] = useState(false);
  const [errorState, setErrorState] = useState({
    "sender_email": false,
    "recipient_email": false
  });

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const handleChange = (state) => (event, isExpanded) => {
    var eState = { ...expandedState };
    eState[state] = isExpanded;
    setExpandedState(eState);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      sender_name: event.target.sender_name.value,
      sender_email: event.target.sender_email.value,
      recipient_first_name: event.target.recipient_first_name.value,
      recipient_last_name: event.target.recipient_last_name.value,
      recipient_email: event.target.recipient_email.value,
      subject: event.target.subject.value,
      template: event.target.template.value,
      config: event.target.config.value,
      attachments: event.target.attachments.value
    }

    console.log(data);

    var eState = { ...errorState };
    eState["sender_email"] = !validateEmail(data.sender_email);
    eState["recipient_email"] = !validateEmail(data.recipient_email);
    setErrorState(eState);
  };

  return (
    <Box component="form" method="post" onSubmit={handleSubmit}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        marginBottom={3}>
        <HomeIcon color="primary" fontSize="large" />
        <Typography variant="h4" color="primary">Home</Typography>
      </Stack>
      <Accordion
        elevation={6}
        expanded={expandedState["sender"]}
        onChange={handleChange("sender")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" spacing={2}>
            <SendIcon />
            <Typography>Sender Profile</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <TextField id="sender_name" required label="Name" />
            <TextField
              id="sender_email"
              error={errorState["sender_email"]}
              helperText={errorState["sender_email"] ? "Invalid Email Address" : ""}
              required label="Email Address" />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={6}
        expanded={expandedState["recipient"]}
        onChange={handleChange("recipient")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack direction="row" spacing={2}>
            <ReplyIcon />
            <Typography>Recipient Profile</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <TextField id="recipient_first_name" label="First Name (Optional)" />
              <TextField id="recipient_last_name" label="Last Name (Optional)" />
            </Stack>
            <TextField
              id="recipient_email"
              error={errorState["recipient_email"]}
              helperText={errorState["recipient_email"] ? "Invalid Email Address" : ""}
              required fullWidth label="Email Address" />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={6}
        expanded={expandedState["email"]}
        onChange={handleChange("email")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack direction="row" spacing={2}>
            <EmailIcon />
            <Typography>Email Template Settings</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField id="subject" required fullWidth label="Subject" />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<HtmlIcon />}
                style={{ textTransform: "none" }}>
                Select HTML Template
              </Button>
              <input id="template" hidden/>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<FolderIcon />}
                style={{ textTransform: "none" }}>
                Select Config
              </Button>
              <input id="config" hidden/>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<AttachmentIcon />}
                style={{ textTransform: "none" }}>
                Upload Attachments
              </Button>
              <input id="attachments" hidden/>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Stack
        justifyContent="center"
        alignItems="center"
        marginTop={3}>
        <Button
          onClickCapture={() => setExpandedState({
            "sender": true,
            "recipient": true,
            "email": true,
          })}
          type="submit"
          variant="contained"
          fullWidth
          style={{ textTransform: "none" }}
          startIcon={<EmailIcon />}>
          Send Email
        </Button>
      </Stack>

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default HomeEmailAction;
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import { open } from '@tauri-apps/api/dialog';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeIcon from "@mui/icons-material/Home";
import AttachmentIcon from '@mui/icons-material/Attachment';
import HtmlIcon from '@mui/icons-material/Html';
import { useState, useRef } from "react";
import { path } from "@tauri-apps/api";
import FormDialog from "./FormDialog";
import MailHelperCore from "../utils/MailHelperCore";
const { Attachment } = require("@zzxzzk115/gophish-api");
const mime = require('mime-types');

const HomeEmailAction = (props) => {

  const { conf } = props;

  const [expandedState, setExpandedState] = useState({
    "sender": true,
    "recipient": true,
    "email": true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorState, setErrorState] = useState({
    "sender_email": false,
    "recipient_email": false
  });
  const templateRef = useRef(null);
  const attachmentsRef = useRef(null);
  const [templateFileName, setTemplateFileName] = useState("");
  const [attachmentsFileName, setAttachmentsFileName] = useState("");
  const [configFields, setConfigFields] = useState([]);
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState("success");
  const [snackbarAlertContent, setSnackbarAlertContent] = useState("");

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const handleChange = (state) => (event, isExpanded) => {
    let eState = { ...expandedState };
    eState[state] = isExpanded;
    setExpandedState(eState);
  };

  const findAllVariables = (html) => {
    let variables = new Set();
    const reg = /{{!(?<name>\w*)}}/ig;
    const array = html.match(reg);
    for (const item of array) {
      const name = item.slice(3, -2);
      variables.add(name);
    }
    return variables;
  };

  const showSnackbar = (severity, content) => {
    setSnackbarAlertSeverity(severity);
    setSnackbarAlertContent(content);
    setSnackbarOpen(true);
  };

  const handleTemplateClick = async () => {
    const selected = await open({
      filters: [{
        name: "HTML",
        extensions: ["html", "htm", "txt"]
      }]
    });
    if (selected) {
      const html = await readTextFile(selected);
      const variables = findAllVariables(html);
      const baseName = await path.basename(selected);
      setTemplateFileName(baseName);
      templateRef.current.value = html;

      // Open dialog for setting variables
      let fields = [];
      for (const variable of variables) {
        fields.push({
          id: variable,
          label: variable,
          type: "text",
          required: true
        });
      }
      setConfigFields(fields);
      setDialogOpen(true);
    }
  };

  const handleAttachmentsClick = async () => {
    const selected = await open({
      multiple: true
    });
    let files = "";
    if (selected) {
      for (const attachmentPath of selected) {
        const baseName = await path.basename(attachmentPath);
        files += baseName + ";";
      }
      setAttachmentsFileName(files.substring(0, files.length - 1));
      attachmentsRef.current.value = selected;
    }
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
      attachments: event.target.attachments.value
    }

    let eState = { ...errorState };
    let a = eState["sender_email"] = !validateEmail(data.sender_email);
    let b = eState["recipient_email"] = !validateEmail(data.recipient_email);
    setErrorState(eState);
    if (a || b) {
      return;
    }

    let ok = false;
    let errMsg = "";
    var mailHelperCore = null;
    try {
      mailHelperCore = new MailHelperCore(conf);
      mailHelperCore.init();

      setBackdropOpen(true);

      await mailHelperCore.addSMTP(data.sender_email, data.sender_name);
      await mailHelperCore.addGroup([
        {
          first_name: data.recipient_first_name,
          last_name: data.recipient_last_name,
          email: data.recipient_email
        }
      ]);
      // Read Attachments and convert them to Base64 Format
      let attachments = null;
      if (data.attachments) {
        attachments = [];
        const attachmentPaths = data.attachments.split(',');
        for (const attachmentPath of attachmentPaths) {
          let attachment = new Attachment();
          attachment.name = await path.basename(attachmentPath);
          attachment.type = mime.lookup(attachment.name);
          const buffer = await readBinaryFile(attachmentPath);
          const content = Buffer.from(buffer).toString("base64");
          attachment.content = content;
          attachments.push(attachment);
        }
      }

      await mailHelperCore.addTemplate(data.subject, data.template, attachments);
      await mailHelperCore.addEmptyPage();
      const result = await mailHelperCore.send();
      console.log(result);
      await mailHelperCore.clean();
      ok = true;
      setBackdropOpen(false);
      showSnackbar("success", "Email sent successfully!");
    } catch (e) {
      console.error(e.message);
      errMsg = e.message;
      setBackdropOpen(false);
      showSnackbar("error", errMsg);
    } finally {
      if (!ok) {
        if (mailHelperCore) {
          await mailHelperCore.clean();
        }
      }
    }
  };

  const handleDialogSubmit = async (event) => {
    event.preventDefault();
    for (const configField of configFields) {
      templateRef.current.value =
        templateRef.current.value
          .replaceAll(
            `{{!${configField.id}}}`,
            event.target[configField.id].value
          );
    }
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box
        component="form"
        method="post"
        onSubmit={handleSubmit}>
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
                  onClick={handleTemplateClick}
                  style={{ textTransform: "none" }}>
                  Select HTML Template
                </Button>
                <Typography>{templateFileName}</Typography>
                <input id="template" ref={templateRef} hidden />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<AttachmentIcon />}
                  onClick={handleAttachmentsClick}
                  style={{ textTransform: "none" }}>
                  Upload Attachments
                </Button>
                <Typography>{attachmentsFileName}</Typography>
                <input id="attachments" ref={attachmentsRef} hidden />
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
      </Box>
      <FormDialog
        open={dialogOpen}
        title="Email Template Variable Settings"
        contentText="Please set values of variables defined in the HTML template."
        fields={configFields}
        enableCancel={false}
        submitText="Apply"
        onSubmit={handleDialogSubmit}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <Stack spacing={3} alignItems="center">
          <Typography>Sending... Please wait...</Typography>
          <CircularProgress color="inherit" />
        </Stack>
      </Backdrop>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={6000}>
        <Alert severity={snackbarAlertSeverity} sx={{ width: '100%' }}>
          {snackbarAlertContent}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeEmailAction;
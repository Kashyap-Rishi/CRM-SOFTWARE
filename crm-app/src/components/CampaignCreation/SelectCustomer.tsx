import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Modal,
  Fade,
  Box,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  CircularProgress,
  useMediaQuery,
  Theme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Rule {
  field: string;
  operator: string;
  value: string;
}

interface CampaignCreationProps {
  open: boolean;
  handleClose: () => void;
}

const personalizedMessages = [
  "Hi Sarah, enjoy 15% off as a token of our appreciation for your continued support!",
  "Hello John, we're offering you 20% off your next purchase as a thank you for being an awesome customer!",
  "Hey Lisa, here's a special discount of 10% off your next order, just for being amazing!",
  "Hey David, we're extending a 20% discount your way as a gesture of gratitude for your business!",
];

const CampaignCreation: React.FC<CampaignCreationProps> = ({
  open,
  handleClose,
}) => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [rules, setRules] = useState<Rule[]>([
    { field: "totalSpends", operator: ">", value: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isAudienceSizeDialogOpen, setIsAudienceSizeDialogOpen] =
    useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const formik = useFormik({
    initialValues: {
      campaignName: "",
      campaignDescription: "",
      rules,
      logic: "AND",
      selectedMessage: "",
    },
    validationSchema: step === 1 ? StepOneSchema : StepTwoSchema,
    onSubmit: (values) => {
      if (step === 1) {
        if (Object.keys(formik.errors).length === 0) {
          setLoading(true);
          axios
            .post("https://crm-x.onrender.com/api/log/create-log", {
              campaignName: values.campaignName,
              campaignDescription: values.campaignDescription,
              rules: values.rules,
              logic: values.logic,
            })
            .then((response) => {
              console.log("Step 1 success:", response);
              setLoading(false);
              setAudienceSize(response.data.message);
              setIsAudienceSizeDialogOpen(true);
            })
            .catch((error) => {
              console.error("Step 1 failed:", error);
              setLoading(false);
              setErrorMessage("Step 1 submission failed");
            });
        } else {
          setErrorMessage("Please correct the errors in the form.");
        }
      } else if (step === 2) {
        setLoading(true);
        axios
          .post("https://crm-x.onrender.com/api/log/template", {
            selectedMessage: values.selectedMessage,
            campaignName: values.campaignName,
          })
          .then((response: any) => {
            console.log("Step 2 success:", response);
            resetForm();
            handleClose();
            setLoading(false);
          })
          .catch((error: any) => {
            console.error("Step 2 failed:", error);
            setLoading(false);
            setErrorMessage("Step 2 submission failed");
          });
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setStep(1);
    setSelectedMessage("");
    setRules([{ field: "totalSpends", operator: ">", value: "" }]);
  };

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSelectMessage = (message: string) => {
    formik.setFieldValue("selectedMessage", message);
    setSelectedMessage(message);
  };

  const handleRuleChange = (
    index: number,
    field: keyof Rule,
    value: string
  ) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
    formik.setFieldValue("rules", updatedRules);
  };

  const addRule = () => {
    setRules([...rules, { field: "totalSpends", operator: ">", value: "" }]);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    formik.setFieldValue("rules", updatedRules);
  };

  const handleAudienceSizeDialogClose = (proceed: boolean) => {
    setIsAudienceSizeDialogOpen(false);
    if (proceed) {
      setStep(step + 1);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="campaign-creation-modal-title"
      aria-describedby="campaign-creation-modal-description"
      closeAfterTransition
    >
      <>
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxHeight: "80%",
              overflowY: "auto",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              CREATE CAMPAIGN
            </Typography>
            <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 2</StepLabel>
              </Step>
            </Stepper>
            {loading ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress />
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                  {step === 1
                    ? "Creating audience, please wait..."
                    : "Sending campaigns, please wait..."}
                </Typography>
              </Box>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                {step === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Campaign Name"
                        name="campaignName"
                        value={formik.values.campaignName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.campaignName &&
                          Boolean(formik.errors.campaignName)
                        }
                        helperText={
                          formik.touched.campaignName &&
                          formik.errors.campaignName
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Campaign Description"
                        name="campaignDescription"
                        value={formik.values.campaignDescription}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.campaignDescription &&
                          Boolean(formik.errors.campaignDescription)
                        }
                        helperText={
                          formik.touched.campaignDescription &&
                          formik.errors.campaignDescription
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {rules.map((rule, index) => (
                        <Box
                          key={index}
                          mb={2}
                          p={2}
                          border={1}
                          borderRadius={4}
                        >
                          <Grid
                            container
                            alignItems="center"
                            sx={{ gap: isMobile ? 2 : 8 }}
                          >
                            <Grid item>
                              <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Field</FormLabel>
                                <RadioGroup
                                  row
                                  name={`rules[${index}].field`}
                                  value={rule.field}
                                  onChange={(e) =>
                                    handleRuleChange(
                                      index,
                                      "field",
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value="totalSpends"
                                    control={<Radio />}
                                    label="totalSpends"
                                  />
                                  <FormControlLabel
                                    value="maxVisits"
                                    control={<Radio />}
                                    label="maxVisits"
                                  />
                                  <FormControlLabel
                                    value="lastVisit"
                                    control={<Radio />}
                                    label="lastVisit (in days)"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item>
                              <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">
                                  Operator
                                </FormLabel>
                                <RadioGroup
                                  row
                                  name={`rules[${index}].operator`}
                                  value={rule.operator}
                                  onChange={(e) =>
                                    handleRuleChange(
                                      index,
                                      "operator",
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value=">"
                                    control={<Radio />}
                                    label=">"
                                  />
                                  <FormControlLabel
                                    value="<"
                                    control={<Radio />}
                                    label="<"
                                  />
                                  <FormControlLabel
                                    value="="
                                    control={<Radio />}
                                    label="="
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item>
                              <TextField
                                fullWidth
                                label="Value"
                                name={`rules[${index}].value`}
                                type="number"
                                value={rule.value}
                                onChange={(e) =>
                                  handleRuleChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            {rules.length > 1 && (
                              <Grid item>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => removeRule(index)}
                                  sx={{ mt: 2 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        variant="contained"
                        onClick={addRule}
                        sx={{
                          mt: 2,
                          backgroundColor: "#7AB2B2",
                          "&:hover": {
                            backgroundColor: "#4D869C",
                          },
                        }}
                      >
                        Add Rule
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Logic</FormLabel>
                        <RadioGroup
                          row
                          name="logic"
                          value={formik.values.logic}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabel
                            value="AND"
                            control={<Radio />}
                            label="AND"
                          />
                          <FormControlLabel
                            value="OR"
                            control={<Radio />}
                            label="OR"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
                {step === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={selectedMessage ? "" : "Selected Message"}
                        placeholder={selectedMessage ? "Selected Message" : ""}
                        name="selectedMessage"
                        value={formik.values.selectedMessage}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.selectedMessage &&
                          Boolean(formik.errors.selectedMessage)
                        }
                        helperText={
                          formik.touched.selectedMessage &&
                          formik.errors.selectedMessage
                        }
                        required
                      />
                      <List sx={{ mt: 2 }}>
                        {personalizedMessages.map((message) => (
                          <ListItem
                            button
                            key={message}
                            onClick={() => handleSelectMessage(message)}
                            selected={selectedMessage === message}
                          >
                            <ListItemText primary={message} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#7AB2B2",
                    "&:hover": {
                      backgroundColor: "#4D869C",
                    },
                  }}
                >
                  {step === 2 ? "Submit" : "Next"}
                </Button>

                <Snackbar
                  open={!!errorMessage}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  message={errorMessage}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                />
              </form>
            )}
          </Box>
        </Fade>
        <Dialog
          open={isAudienceSizeDialogOpen}
          onClose={() => handleAudienceSizeDialogClose(false)}
        >
          <DialogTitle>Audience Created</DialogTitle>
          <DialogContent>
            <>
              <DialogContentText sx={{ color: "black", fontWeight: "bold" }}>
                Audience size: {audienceSize}
              </DialogContentText>
              <DialogContentText>
                Do you want to proceed to the next step or decline?
              </DialogContentText>
            </>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleAudienceSizeDialogClose(false)}
              color="primary"
            >
              Decline
            </Button>
            <Button
              onClick={() => handleAudienceSizeDialogClose(true)}
              color="primary"
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Modal>
  );
};

const StepOneSchema = Yup.object().shape({
  campaignName: Yup.string().required("Campaign Name is required"),
  campaignDescription: Yup.string(),
  rules: Yup.array().of(
    Yup.object().shape({
      field: Yup.string().required("Field is required"),
      operator: Yup.string().required("Operator is required"),
      value: Yup.string().required("Value is required"),
    })
  ),
  logic: Yup.string().required("Logic is required"),
});

const StepTwoSchema = Yup.object().shape({
  selectedMessage: Yup.string().required("Please select a message"),
});

export default CampaignCreation;

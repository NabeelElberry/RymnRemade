import { TextField } from "@mui/material";

export default function CustomTextBox({
  multi,
  inputRef,
  currentlyAdd,
  labelText,
  style,
}) {
  if (multi) {
    return (
      <TextField
        id="filled-basic"
        label={
          labelText ? labelText : currentlyAdd ? "Terms" : "Terms / Definitions"
        }
        variant="filled"
        required
        autoComplete="off"
        multiline
        className={`w-4/5 ${style}`}
        minRows="4"
        sx={{
          "& .MuiFilledInput-root": {
            backgroundColor: "#282420", // Background color of the filled input
            color: "#F1BDBD",
            textAlign: "center",

            // Text color of the filled input
          },
          "& .MuiFilledInput-underline:before": {
            borderBottomColor: "#5C3F76", // Color of the underline when not focused
          },
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: "#5C3F76", // Color of the underline when focused
          },
          "& .MuiInputLabel-root": {
            color: "#DDDDDD", // Color of the label
          },
          "& .MuiInputLabel-filled.Mui-focused": {
            color: "#DDDDDD", // Color of the label
          },
        }}
        inputRef={inputRef}
      />
    );
  } else {
    return (
      <TextField
        id="filled-basic"
        label={
          labelText ? labelText : currentlyAdd ? "Terms" : "Terms / Definitions"
        }
        variant="filled"
        required
        autoComplete="off"
        className={`w-4/5 ${style}`}
        minRows="4"
        sx={{
          "& .MuiFilledInput-root": {
            backgroundColor: "#282420", // Background color of the filled input
            color: "#F1BDBD",
            textAlign: "center",

            // Text color of the filled input
          },
          "& .MuiFilledInput-underline:before": {
            borderBottomColor: "#5C3F76", // Color of the underline when not focused
          },
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: "#5C3F76", // Color of the underline when focused
          },
          "& .MuiInputLabel-root": {
            color: "#DDDDDD", // Color of the label
          },
          "& .MuiInputLabel-filled.Mui-focused": {
            color: "#DDDDDD", // Color of the label
          },
        }}
        inputRef={inputRef}
      />
    );
  }
}

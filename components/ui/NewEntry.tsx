import { ChangeEvent, useState, useContext } from 'react';
import { Button, Box, TextField } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { EntriesContext } from '../../context/entries';
import { UIContext } from '../../context/ui';

export const NewEntry = () => {
  const { addNewEntry } = useContext(EntriesContext);
  const { isAddingEntry, setIsAddingEntry } = useContext(UIContext);

  const [inputValue, setInputValue] = useState("");
  const [touched, setTouched] = useState(false);


  const onTextFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  }

  const onSave = () => {
    if (inputValue.length === 0) return;
    addNewEntry(inputValue);
    setInputValue("");
    setIsAddingEntry(false);
    setTouched(false);
  }

  return (
    <Box sx={{ padding: "0px 10px 15px 10px" }}>
      {isAddingEntry ? (
        <>
          <TextField
            fullWidth
            sx={{ marginTop: 2, marginBottom: 2 }}
            placeholder="Nueva entrada"
            autoFocus
            multiline
            label="Nueva entrada"
            helperText={inputValue.length <= 0 && touched && "Ingrese un valor"}
            error={inputValue.length <= 0 && touched }
            value={inputValue}
            onChange={onTextFieldChange}
            onBlur={() => setTouched(true)}
          />
          <Box display="flex" justifyContent="space-between">
            <Button variant="text" onClick={() => {setIsAddingEntry(false);}}>Cancelar</Button>

            <Button
              variant="outlined"
              color="secondary"
              endIcon={<SaveOutlinedIcon />}
              onClick={onSave}
            >
              Guardar
            </Button>
          </Box>
        </>
      ) : (
        <Button startIcon={<AddIcon />} fullWidth variant="outlined" onClick={() => setIsAddingEntry(true)}>
          Agregar Tarea
        </Button>
      )}
    </Box>
  );
};

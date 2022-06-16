import { useState, ChangeEvent, useMemo, FC, useContext } from "react";
import { GetServerSideProps } from "next";
import {
  capitalize,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  IconButton,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Layout } from "../../components/layouts";
import { Entry, EntryStatus } from "../../interfaces";
import { isValidObjectId } from "mongoose";
import { dbEntries } from "../../database";
import { IEntry } from "../../models";
import { EntriesContext } from "../../context/entries";
import { useRouter } from 'next/router';
import { dateFunctions } from "../../utils";

const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"];

interface Props {
  entry: IEntry
}

const EntryPage: FC<Props> = ({ entry }) => {
  const { updateEntry, removeEntry } = useContext(EntriesContext)
  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  const isNotValid = useMemo(
    () => inputValue.length <= 0 && touched,
    [inputValue, touched]
  );

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(event.target.value);
  };

  const onStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  };

  const onSave = () => {
    if (inputValue.trim().length === 0) return;
    
    const updatedEntry: Entry = {
      ...entry,
      status,
      description: inputValue
    }
    
    updateEntry(updatedEntry, true);
  };

  const handleRemoveEntry = () => {
    removeEntry(entry._id, true);
    router.push("/");
  }

  return (
    <Layout title={inputValue.substring(0,10) + "..."}>
      <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={`Entrada: ${inputValue}`}
              subheader={dateFunctions.getFormatDistanceToNow(entry.createdAt)}
            />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                fullWidth
                placeholder="Nueva entrada"
                autoFocus
                multiline
                label="Nueva entrada"
                value={inputValue}
                onChange={onInputChange}
                onBlur={() => setTouched(true)}
                helperText={isNotValid && "Ingrese un valor"}
                error={isNotValid}
              />
              <FormControl>
                <FormLabel>Stado:</FormLabel>
                <RadioGroup row value={status} onChange={onStatusChange}>
                  {validStatus.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SaveOutlinedIcon />}
                variant="contained"
                fullWidth
                onClick={onSave}
                disabled={inputValue.length <= 0}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgrounColor: "red",
        }}
        onClick={handleRemoveEntry}
      >
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };
  
  const entry = await dbEntries.getEntryById(id);

  if (!entry) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      entry: entry
    },
  };
};

export default EntryPage;

import { createContext, FC, useEffect, useReducer } from "react";
import { Entries, Entry } from "../../interfaces";
import { EntriesContext, entriesReducer } from "./";
import entriesApi from '../../apis/entriesApi';
import { useSnackbar } from 'notistack';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const INITIAL_STATE: Entries = {
  entries: [],
};

export const EntriesProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  const addNewEntry = async (description: string) => {
    const { data } = await entriesApi.post<Entry>("/entries", { description });
    dispatch({ type: "[Entry] Add-Entry", payload: data });
  };

  const updateEntry = async({ _id, description, status }: Entry, showSnackbar = false) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status });
      dispatch({ type: "[Entry] Update-entry", payload: data });

      if (showSnackbar) {
        enqueueSnackbar("Entrada actualizada", {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        });
      }

    } catch(error) {
      console.log("ERROR ", error);
    }
  }

  const removeEntry = async(id: string, showSnackbar = false) => {
    await entriesApi.delete(`/entries/${id}`);
    dispatch({ type: "[Entry] Remove-entry", payload: id });

    if (showSnackbar) {
      enqueueSnackbar("Entrada Eliminada", {
        variant: "success",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      });
    }
  }

  const refreshEntries = async() => {
    const { data } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] Get-entry", payload: data });
  }

  useEffect(() => {
    refreshEntries();
  }, []);
  

  return (
    <EntriesContext.Provider
      value={{
        ...state,
        // methods
        addNewEntry,
        updateEntry,
        removeEntry
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

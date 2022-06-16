import { Entries, Entry } from "../../interfaces";

type EntriesActionType =
  | { type: "[Entry] Add-Entry"; payload: Entry }
  | { type: "[Entry] Update-entry"; payload: Entry }
  | { type: "[Entry] Get-entry"; payload: Entry[] }
  | { type: "[Entry] Remove-entry"; payload: string };

export const entriesReducer = (
  state: Entries,
  action: EntriesActionType
): Entries => {
  switch (action.type) {
    case "[Entry] Add-Entry":
      return {
        ...state,
        entries: [...state.entries, action.payload],
      };
    case "[Entry] Update-entry":
      return {
        ...state,
        entries: state.entries.map((entry) => {
          if (entry._id === action.payload._id) {
            entry.status = action.payload.status;
            entry.description = action.payload.description;
          }
          return entry;
        }),
      };
    case "[Entry] Get-entry":
      return {
        ...state,
        entries: [...action.payload],
      };

    case "[Entry] Remove-entry":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry._id !== action.payload),
      };

    default:
      return state;
  }
};

import { DragEvent, FC, useContext, useMemo } from "react";

import { List, Paper } from "@mui/material";

import { EntriesContext } from "../../context/entries";
import { EntryStatus } from "../../interfaces";
import { EntryCard } from "./EntryCard";
import { UIContext } from "../../context/ui";

import styles from "./EntryList.module.css";

interface Props {
  status: EntryStatus;
}

export const EntryList: FC<Props> = ({ status }) => {
  const { entries, updateEntry } = useContext(EntriesContext);
  const { isDragging, endDragging } = useContext(UIContext);

  const entriesByStatus = useMemo(() => entries.filter(entry => entry.status === status), [entries]);

  const onDropEntry = (event: DragEvent) => {
    const id = event.dataTransfer.getData("text");
    const entry = entries.find(entry => entry._id === id)!;
    entry.status = status;
    updateEntry(entry);
    endDragging();
  }

  const allowDrop = (event: DragEvent) => {
    event.preventDefault();
  }

  return (
    <div
      onDrop={onDropEntry}
      onDragOver={allowDrop}
      className={ isDragging ? styles.dragging : "" }
    >
      <Paper
        sx={{
          height: "calc(100vh - 250px)",
          backgroundColor: "transparent",
          padding: "0px 10px",
        }}
      >
        <List sx={{ opacity: isDragging ? 0.3 : 1, transition: "all 0.3s" }}>
          {
            entriesByStatus.map(entry => (
              <EntryCard key={entry._id} entry={entry} />
            ))
          }
        </List>
      </Paper>
    </div>
  );
};

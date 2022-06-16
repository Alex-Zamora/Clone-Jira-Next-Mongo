import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from 'mongoose';
import { db } from "../../../../database";
import { Entry, IEntry } from "../../../../models";

type Data = 
| { message: string }
| IEntry

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  // example of a middleware in next
  // const { id } = req.query;
  // if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "El ID no es válido " + id });

  switch (req.method) {
    case "PUT":
      return updateEntry(req, res);
    case "GET":
      return getEntry(req, res);
    case "DELETE":
      return removeEntry(req, res);
    default:
      return res.status(400).json({ message: "El método no existe"});
  }
}

const removeEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { id } = req.query;
    await db.connect();
    const entry = await Entry.findByIdAndRemove(id);

    if (!entry) {
      await db.disconnect();
      return res.status(400).send({ message: "No hay entrada con ese ID" });
    }

    await db.disconnect();
    
    // simbolo ! significa siempre vas a tener un valor
    return res.status(200).json(entry!);
  } catch(error ) {
    console.log("ERROR ", error);
  }
}

const updateEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;

  await db.connect();

  const entryToUpdate = await Entry.findById(id);

  if (!entryToUpdate) {
    await db.disconnect();
    return res.status(400).send({ message: "No hay entrada con ese ID" });
  }

  const { description = entryToUpdate.description, status = entryToUpdate.status } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true });
    await db.disconnect();
    // simbolo ! significa siempre vas a tener un valor
    return res.status(200).json(updatedEntry!);
  } catch (error: any) {
    await db.disconnect();
    return res.status(400).json({ message: error.errors.status.message });
  }
}

const getEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  await db.connect();
  const entry = await Entry.findById(id);
  await db.disconnect();

  if (!entry) {
    return res.status(400).send({ message: "No hay entrada con ese ID" });
  }
  return res.status(200).json(entry);
}

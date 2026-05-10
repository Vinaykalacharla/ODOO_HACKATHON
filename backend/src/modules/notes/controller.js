import * as noteService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const listNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes(req.params.id);
    return sendSuccess(res, notes);
  } catch (err) {
    next(err);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.params.id, req.body);
    return sendSuccess(res, note, 201);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(req.params.noteId, req.params.id, req.body);
    return sendSuccess(res, note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.noteId, req.params.id);
    return sendSuccess(res, { message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};

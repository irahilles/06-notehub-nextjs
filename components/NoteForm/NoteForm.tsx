'use client'
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import css from './NoteForm.module.css';
import * as Yup from "yup";
import type { NoteTag } from '@/types/notes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';

interface NoteFormProps{
    onClose: () => void;
}

export interface InitialValuesProps{
    title: string,
    content: string,
    tag: NoteTag,
}

const initialValues: InitialValuesProps = {
    title: '',
    content: '',
    tag: 'Todo',
}

export default function NoteForm({ onClose }: NoteFormProps) {
const NoteFormSchema = Yup.object({
   title: Yup.string()
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name is too long")
          .required("Name is required"),
   content: Yup.string().max(500, "Content is too long"),
   tag: Yup.mixed<NoteTag>()
        .oneOf(
         ["Todo", "Work", "Personal", "Meeting", "Shopping"],
         "Choose a valid tag"
         )
        .required("Tag is required"),
})
    
    const queryClient = useQueryClient();
    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose();
        }
    })
    
const handleSubmit = async (
  values: InitialValuesProps,
  actions: FormikHelpers<InitialValuesProps>
) => {
  await createNoteMutation.mutateAsync(values);
  actions.resetForm();
};

    return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
    <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <Field id="title" type="text" name="title" className={css.input} />
    <ErrorMessage name="title" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <Field as='textarea' id="content" name="content" rows={8} className={css.textarea}/>
    <ErrorMessage name="content" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <Field as='select' id="tag" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" component="span" className={css.error}/>
  </div>

<div className={css.actions}>
       {createNoteMutation.isError && (
  <p className={css.error} role="alert">
    There was an error: {createNoteMutation.error.message}
  </p>
)}             
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
                    
   <button type="submit" className={css.submitButton} disabled={createNoteMutation.isPending}>
          {createNoteMutation.isPending ? "Adding..." : "Create note"}
  </button>           
  </div>
        </Form>
        </Formik>
    )
}
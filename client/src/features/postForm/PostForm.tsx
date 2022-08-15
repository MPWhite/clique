import "./PostForm.scss";
import { Formik } from "formik";

export function PostForm() {
  return (
    <div className="PostForm">
      <h1>Create a Post</h1>
      <Formik
        initialValues={{ link: "", title: "" }}
        validate={(values) => {
          const errors: { link?: string; title?: string } = {};
          if (!values.link) {
            errors.link = "Link Required";
          }
          if (!values.title) {
            errors.link = "Title Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              onChange={handleChange}
              name="title"
              onBlur={handleBlur}
              value={values.title}
            />
            {errors.title && touched.title && errors.title}
            <label>Link</label>
            <input
              onChange={handleChange}
              name="link"
              formNoValidate={true}
              onBlur={handleBlur}
              value={values.link}
            />
            {errors.link && touched.link && errors.link}
            <button type="submit" disabled={isSubmitting}>
              Post
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

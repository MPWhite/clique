import "./PostForm.scss";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

export function PostForm() {
  const navigate = useNavigate();

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
            const authToken = localStorage.getItem("AUTH");
            if (!authToken) {
              navigate("/login");
              return;
            }
            const postReq = {
              // TODO
              serverId: "9f3f6848-4401-4660-b764-452ac4e3624b",
              // @ts-ignore
              link: values.link,
              title: values.title,
            };
            fetch("/api/posts", {
              method: "POST",
              headers: {
                Authorization: authToken,
                "Content-type": "application/json",
              },
              body: JSON.stringify(postReq),
            })
              .then((response) => response.json())
              .then((data) => {
                navigate("/");
              })
              .catch((err) => {
                alert(err);
              });

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

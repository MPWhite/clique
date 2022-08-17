import { Field, Formik } from "formik";
import "./LoginForm.scss";

export function Login() {
  return (
    <>
      <h1>Login</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={() => {}}
        validate={(values) => {
          if (values.username.length > 1 && values.password.length > 1) {
            return [];
          }
          return ["eh"];
        }}
      >
        {({
          touched,
          values,
          isValid,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => {
          return (
            <form onSubmit={handleSubmit} className="LoginForm">
              <input
                onChange={handleChange}
                name="username"
                value={values.username}
                onBlur={handleBlur}
                placeholder="username"
              ></input>
              <input
                onChange={handleChange}
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                placeholder="password"
              ></input>
              <button
                disabled={!isValid || !touched.password || !touched.username}
              >
                Login
              </button>
            </form>
          );
        }}
      </Formik>
      <p>Don't have an account? That's too bad.</p>
    </>
  );
}

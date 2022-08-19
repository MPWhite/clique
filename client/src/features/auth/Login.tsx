import { Field, Formik } from "formik";
import "./LoginForm.scss";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Login</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          const loginReq = {
            username: values.username,
            password: values.password,
          };
          console.log(JSON.stringify(loginReq));
          fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(loginReq),
          })
            .then((resp) => resp.json())
            .then((data) => {
              console.log(data);
              const { authToken } = data;
              if (!authToken) {
                throw Error("Auth token not in response");
              }
              localStorage.setItem("AUTH", authToken);
              navigate("/");
            });
          setSubmitting(false);
        }}
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
          isSubmitting,
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
              <button disabled={isSubmitting || !isValid}>Login</button>
            </form>
          );
        }}
      </Formik>
      <p>Don't have an account? That's too bad.</p>
    </>
  );
}

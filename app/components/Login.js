import React from "react";
import { Formik } from "formik";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
        if (!values.password) {
          errors.password = "Required";
        } else if (values.password.length < 6) {
          errors.password = "Password must be at least 6 characters long";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const result = await signIn("login", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result.error) {
          alert(result.error);
        } else {
          alert("Login successful");
          console.log(result);
        }

        setSubmitting(false);
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
      }) => (
        <>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-500 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                id="email"
                className={`w-full p-2 border bg-[#1e1f20] text-gray-400 ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-[#1e1f20]"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-500 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                id="password"
                className={`w-full mt-1 p-3 border bg-[#1e1f20] text-gray-400 ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-[#1e1f20]"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient text-white p-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <div className="flex items-center gap-1 text-gray-400">
              <span className="w-full h-[1px] bg-gray-400"></span>
              <span>or</span>
              <span className="w-full h-[1px] bg-gray-400"></span>
            </div>
          </form>
          <button
            className="flex items-center gap-4 justify-center bg-black w-full p-2 mt-1 rounded-lg text-gray-400 hover:shadow-lg transition-all"
            onClick={() => {
              signIn("google");
            }}
          >
            <span>
              <FcGoogle className="text-xl" />
            </span>
            <span>Continue with Google</span>
          </button>
        </>
      )}
    </Formik>
  );
};

export default Login;

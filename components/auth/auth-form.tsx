import { useState, useRef } from "react";
import classes from "./auth-form.module.css";

function AuthForm(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function createUser(
    email: string | undefined,
    password: string | undefined
  ): Promise<void> {
    // send data to API
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    return data;
  }

  function switchAuthModeHandler(): void {
    setIsLogin((prevState) => !prevState);
  }

  function submitHandler(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    // optional: Add validation

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      setErrorMessage("Please enter a valid email address and password!");
      return;
    }

    if (isLogin) {
    } else {
      try {
        const result = createUser(email, password);
        console.log(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
        console.log(error);
      }
    }

    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
        </div>
      </form>
    </section>
  );
}

export default AuthForm;

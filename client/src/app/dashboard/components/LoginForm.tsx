"use client"

import { useState } from "react";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [data, setData] = useState<Record<string, string> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/users/admin", {
        credentials: "include"
      });

      if (res.ok) {
        const data: Record<string, string> = await res.json();

        setData(data);
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log("data", data)
  return (
    <form
      className={styles["form"]}
      onSubmit={handleSubmit}
    >
      <div
        className={styles["form-field"]}
      >
        <label
          htmlFor="username"
        >
          Käyttäjänimi
        </label>
        <input
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div
        className={styles["form-field"]}
      >
        <label
          htmlFor="password"
        >
          Salasana
        </label>
        <input
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
      >
        Kirjaudu
      </button>
      <div>
        <div>
          Data from the endpoint:
        </div>
        <div>
          {data && Object.entries(data).map(([k, v], index) => (
            <div key={index}>{k}{v}</div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
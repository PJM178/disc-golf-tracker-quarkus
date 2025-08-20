"use client"

import { useState } from "react";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";
import TextField from "@/components/Inputs";
import { Button } from "@/components/Buttons";

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [data, setData] = useState<Record<string, string> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (res.ok) {
        const data: Record<string, string> = await res.json();

        setData(data);
        console.log(data);

        setTimeout(() => {
          router.replace("http://localhost:3000/dashboard");
        }, 2000);
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
        <TextField
          variant="outlined"
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
        <TextField
          variant="outlined"
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        className="form--buttons-forward"
        variant="primary"
        type="submit"
      >
        <span>Kirjaudu</span>
      </Button>
      <div>
        <div>
          Data from the endpoint:
        </div>
        <div>
          {data && !data.length && Object.entries(data).map(([k, v], index) => (
            <div key={index}>{k}{v}</div>
          ))}
          {data && data.length && (data as unknown as Record<string, string>[]).map((r, index) => {
            const [k, v] = Object.entries(r);

            return (
              <div key={index}>{k}{v}</div>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
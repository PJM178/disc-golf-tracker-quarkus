"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/navigation";
import TextField from "@/components/Inputs";
import { Button } from "@/components/Buttons";
import useDebounce from "@/app/hooks/useDebounce";


interface CurrentStep {
  step: number;
  maxStep: number;
}

interface StepTrackerProps {
  currentStep: CurrentStep;
}

const StepTracker = ({ currentStep }: StepTrackerProps) => {
  return (
    <div
      className={styles["step-tracker--container"]}
    >
      <div>
        <span>Vaihe </span><span>{currentStep.step} / {currentStep.maxStep}</span>
      </div>
      <div
        className={styles["step-tracker--step-container"]}
      >
        {Array.from({ length: currentStep.maxStep }, (_, i) => i + 1).map((step, index) => (
          <div
            key={index}
            className={`${styles["step-tracker--step"]} ${step <= currentStep.step ? "" : styles["step-tracker--step-shadow"]}`.trim()}
            style={step <= currentStep.step ? { backgroundColor: "purple" } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CurrentStep>({ step: 1, maxStep: 3 });
  const [username, setUsername] = useState<string>("");
  const { debouncedValue } = useDebounce(username, 500);
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [usernameTakenError, setUsernameTakenError] = useState("");

  // Check using debounced value if the username is taken
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:8080/users/check/${debouncedValue}`);

        const data: { available: boolean } = await res.json();

        if (data.available) {
          setUsernameTakenError("");
        } else {
          setUsernameTakenError("Username taken");
        }
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    }

    fetchUser();
  }, [debouncedValue]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        username,
        password,
        firstName,
        lastName,
      };

      const res = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        const data: Record<string, string> = await res.json();

        console.log(data);

        // setTimeout(() => {
        //   router.replace("http://localhost:3000/dashboard");
        // }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleButtons = (currentStep: CurrentStep) => {
    if (currentStep.step === currentStep.maxStep) {
      return (
        <>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step - 1 }))}
          >
            <span>Edellinen</span>
          </Button>
          <Button
            className="form--buttons-forward"
            variant="primary"
            type="button"
            onClick={handleSubmit}
          >
            <span>Rekisteröidy</span>
          </Button>
        </>
      );
    }

    return (
      <>
        {currentStep.step !== 1 &&
          <Button
            variant="secondary"
            type="button"
            onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step - 1 }))}
          >
            <span>Edellinen</span>
          </Button>}
        <Button
          className="form--buttons-forward"
          variant="primary"
          type="button"
          onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step + 1 }))}
        >
          <span>Seuraava</span>
        </Button>
      </>
    )
  }

  const handleCurrentStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2><span>Käyttäjätiedot</span></h2>
            <div
              className="form-field"
            >
              {usernameTakenError}
              <label
                htmlFor="username"
              >
                Käyttäjänimi
              </label>
              <TextField
                variant="outlined"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div
              className="form-field"
            >
              <label
                htmlFor="password"
              >
                Salasana
              </label>
              <TextField
                variant="outlined"
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2><span>Henkilötiedot</span></h2>
            <div
              className="form-field"
            >
              <label
                htmlFor="username"
              >
                Etunimi
              </label>
              <TextField
                variant="outlined"
                name="first-name"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div
              className="form-field"
            >
              <label
                htmlFor="password"
              >
                Sukunimi
              </label>
              <TextField
                variant="outlined"
                name="last-name"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2><span>Yhteenveto</span></h2>
            <h3><span>Käyttäjätiedot</span></h3>
            <div>
              <div>{username}</div>
            </div>
            <h3><span>Henkilötiedot</span></h3>
            <div>
              <div>{firstName}</div>
              <div>{lastName}</div>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div>

      <form
        className="form"
      >
        <StepTracker
          currentStep={currentStep}
        />
        <div
          className="form--content"
        >
          {handleCurrentStep(currentStep.step)}
        </div>
        <div
          className="form--buttons"
        >
          {handleButtons(currentStep)}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
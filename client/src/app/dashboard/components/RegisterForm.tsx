"use client"

import { useState } from "react";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/navigation";


interface CurrentStep {
  step: number;
  maxStep: number;
}

interface StepTrackerProps {
  currentStep: CurrentStep;
}

const StepTracker = ({ currentStep }: StepTrackerProps) => {
  return (
    <div>
      <div>
        <span>Vaihe </span><span>{currentStep.step} / {currentStep.maxStep}</span>
      </div>
      <div
        className={styles["step-tracker--container"]}
      >
        {Array.from({ length: currentStep.maxStep }, (_, i) => i + 1).map((step, index) => (
          <div
            key={index}
            className={styles["step-tracker--step"]}
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
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [data, setData] = useState<Record<string, string> | null>(null);

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

        setData(data);
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
        <div>
          <button
            type="button"
            onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step - 1 }))}
          >
            <span>Edellinen</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
          >
            <span>Rekisteröidy</span>
          </button>
        </div>
      );
    }

    return (
      <div>
        {currentStep.step !== 1 &&
          <button
            type="button"
            onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step - 1 }))}
          >
            <span>Edellinen</span>
          </button>}
        <button
          type="button"
          onClick={() => setCurrentStep((prevValue) => ({ ...prevValue, step: prevValue.step + 1 }))}
        >
          <span>Seuraava</span>
        </button>
      </div>
    )
  }

  const handleCurrentStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2><span>Käyttäjätiedot</span></h2>
            <div
              className="form-field"
            >
              <label
                htmlFor="username"
              >
                Käyttäjänimi
              </label>
              <input
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
              <input
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2><span>Henkilötiedot</span></h2>
            <div
              className="form-field"
            >
              <label
                htmlFor="username"
              >
                Etunimi
              </label>
              <input
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
              <input
                name="last-name"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
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
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <StepTracker
        currentStep={currentStep}
      />
      <form
        className="form"
      >
        {handleCurrentStep(currentStep.step)}
        {handleButtons(currentStep)}
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
    </div>
  );
};

export default RegisterForm;
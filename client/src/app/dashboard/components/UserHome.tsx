"use client"

import NewGameForm from "@/components/NewGameForm";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

const HelloUser = () => {
  const { user } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(true);

  if (!user) return (
    <div>
      Nothing here
      {/* Test new game form here - remove when done */}
      {isFormOpen && <NewGameForm closeDialog={() => setIsFormOpen(false)} />}
    </div>
  );

  return (
    <div>
      <span>Hello, {user.name}</span>
    </div>
  );
};

export default HelloUser;
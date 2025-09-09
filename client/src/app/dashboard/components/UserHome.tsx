"use client"

import NewGameForm from "@/components/NewGameForm";
import { useUser } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// TODO: move the QueryClientProvider to app layout.tsx with SSR considerations in future, for
// now simply test it

const queryClient = new QueryClient();

const HelloUser = () => {
  const { user } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(true);

  if (!user) return (
    <div>
      Nothing here
      {/* Test new game form here - remove when done */}
      {isFormOpen &&
        <QueryClientProvider client={queryClient}>
          <NewGameForm closeDialog={() => setIsFormOpen(false)} />
        </QueryClientProvider>
      }
    </div>
  );

  return (
    <div>
      <span>Hello, {user.name}</span>
    </div>
  );
};

export default HelloUser;
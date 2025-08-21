"use client"

import { useUser } from "@/context/UserContext";

const HelloUser = () => {
  const { user } = useUser();
  
  if (!user) return <div>Nothing here</div>

  return (
    <div>
      <span>Hello, {user.name}</span>
    </div>
  );
};

export default HelloUser;
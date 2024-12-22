import React, { createContext, useContext } from "react";
import { Auth0User } from "@privasee/types";
import { useUsers } from "@/services/auth0";

interface Auth0UsersContextType {
  users: Auth0User[];
}

const Auth0UsersContext = createContext<Auth0UsersContextType | undefined>(
  undefined
);

export function Auth0UsersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = useUsers();

  const value = {
    users,
  };

  return (
    <Auth0UsersContext.Provider value={value}>
      {children}
    </Auth0UsersContext.Provider>
  );
}

export function useAuth0Users() {
  const context = useContext(Auth0UsersContext);
  if (context === undefined) {
    throw new Error("useAuth0Users must be used within an Auth0UsersProvider");
  }
  return context;
}

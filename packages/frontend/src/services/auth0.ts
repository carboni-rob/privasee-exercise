import { useCallback, useEffect, useState } from "react";

const options = {
  method: "GET",
  url: "https://dev-l2o673tblbvjz6u0.us.auth0.com/api/v2/users",
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH0_API_ACCESS_TOKEN}`,
  },
};

export const useUsers = () => {
  const [users, setUsers] = useState();

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch(options.url, {
        headers: options.headers,
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      setUsers(json);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return users;
};

import Image from "next/image";
import { Auth0User } from "@privasee/types";

interface UserChipProps {
  user: Auth0User | undefined;
}

const UserChip: React.FC<UserChipProps> = ({ user }) => {
  if (!user) return <></>;

  const displayName = user.name || user.email;

  return (
    <div
      className={`inline-flex items-center max-w-full bg-gray-100 rounded-full pr-3 pl-1 py-1`}
    >
      {user.picture ? (
        <Image
          src={user.picture}
          alt={displayName}
          width={42}
          height={42}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
          {(user.email[0] || "?").toUpperCase()}
        </div>
      )}
      <span className="ml-2 truncate text-sm font-medium text-gray-700">
        {displayName}
      </span>
    </div>
  );
};

export default UserChip;

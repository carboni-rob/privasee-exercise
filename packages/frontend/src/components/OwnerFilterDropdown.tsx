import React, { useState, useRef, useEffect } from "react";
import { useAuth0Users } from "@/contexts/Auth0UsersContext";
import UserChip from "./UserChip";

interface OwnerFilterDropdownProps {
  selectedEmails: string[];
  onChange: (emails: string[]) => void;
}

const OwnerFilterDropdown: React.FC<OwnerFilterDropdownProps> = ({
  selectedEmails,
  onChange,
}) => {
  const { users } = useAuth0Users();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUser = (email: string) => {
    if (selectedEmails.includes(email)) {
      onChange(selectedEmails.filter((e) => e !== email));
    } else {
      onChange([...selectedEmails, email]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-md ${
          selectedEmails.length > 0
            ? "bg-blue-100 text-blue-800"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {selectedEmails.length === 0
          ? "Owners"
          : `${selectedEmails.length} Selected`}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
          <div className="py-2">
            {users.map((user) => (
              <div
                key={user.email}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => toggleUser(user.email)}
              >
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(user.email)}
                  onChange={() => toggleUser(user.email)}
                  className="mr-3 rounded border-gray-300"
                />
                <UserChip user={user} />
              </div>
            ))}
            {selectedEmails.length > 0 && (
              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => onChange([])}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 w-full text-left"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFilterDropdown;

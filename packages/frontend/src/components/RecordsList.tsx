import React from "react";
import { RecordOut } from "@privasee/types";
import Spinner from "./Spinner";
import { formatDate } from "@/utils/dateFormatters";
import { useAuth0Users } from "@/contexts/Auth0UsersContext";
import UserChip from "./UserChip";
import UnassignedChip from "./UnassignedChip";

interface RecordListProps {
  records: RecordOut[];
  loading: boolean;
  error: string | null;
}

const RecordList: React.FC<RecordListProps> = ({ records, loading, error }) => {
  const { users } = useAuth0Users();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        Error loading records: {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Question
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Assigned To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created by
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created at
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => {
            const assignedUser = users.find(
              (user) => user.email === record.assignedTo
            );
            const creatingUser = users.find(
              (user) => user.email === record.createdBy
            );

            return (
              <tr key={record._recordId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="text-sm text-gray-500 font-semibold">
                      {record.question}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignedUser ? (
                    <UserChip user={assignedUser} />
                  ) : (
                    <UnassignedChip />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <UserChip user={creatingUser} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordList;

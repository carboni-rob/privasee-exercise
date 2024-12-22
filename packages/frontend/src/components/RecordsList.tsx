import React, { useState } from "react";
import Link from "next/link";
import { RecordOut } from "@privasee/types";
import { formatDate } from "@/utils/dateFormatters";
import { useAuth0Users } from "@/contexts/Auth0UsersContext";
import Spinner from "./Spinner";
import UserChip from "./UserChip";
import UnassignedChip from "./UnassignedChip";
import BulkAssignModal from "./BulkAssignModal";

interface RecordListProps {
  records: RecordOut[];
  loading: boolean;
  error: string | null;
  onRecordsUpdated?: () => void;
}

const RecordList: React.FC<RecordListProps> = ({
  records,
  loading,
  error,
  onRecordsUpdated,
}) => {
  const { users } = useAuth0Users();
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRecords(records.map((r) => r._recordId!));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (recordId: number) => {
    setSelectedRecords((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  const handleBulkAssign = async (assignedTo: string) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/records/bulk/assign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recordIds: selectedRecords,
            assignedTo,
            updatedBy: "admin@example.com", // You might want to get this from your auth context
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign records");
      }

      // Clear selections and refresh the list
      setSelectedRecords([]);
      if (onRecordsUpdated) {
        onRecordsUpdated();
      }
    } catch (err) {
      setAssignmentError(
        err instanceof Error ? err.message : "Failed to assign records"
      );
      throw err;
    }
  };

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
    <>
      {selectedRecords.length > 0 && (
        <div className="bg-blue-50 p-4 mb-4 rounded-md flex items-center justify-between">
          <span className="text-blue-700">
            {selectedRecords.length} records selected
          </span>
          <button
            onClick={() => setIsBulkAssignModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Assign Selected
          </button>
        </div>
      )}

      {assignmentError && (
        <div className="bg-red-50 p-4 mb-4 rounded-md text-red-700">
          {assignmentError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRecords.length === records.length}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
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
                Created by
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record._recordId!)}
                      onChange={() => handleSelectRecord(record._recordId!)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="text-sm text-gray-500 font-semibold">
                        {record.question}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserChip user={creatingUser} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignedUser ? (
                      <UserChip user={assignedUser} />
                    ) : (
                      <UnassignedChip />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Link href={`/question/${record._recordId}`}>
                        View/Edit
                      </Link>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BulkAssignModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        onAssign={handleBulkAssign}
        selectedCount={selectedRecords.length}
      />
    </>
  );
};

export default RecordList;

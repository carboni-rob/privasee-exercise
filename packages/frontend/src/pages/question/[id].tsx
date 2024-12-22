import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { RecordOut } from "@privasee/types";
import { useAuth0Users } from "@/contexts/Auth0UsersContext";
import UserChip from "@/components/UserChip";
import UnassignedChip from "@/components/UnassignedChip";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const RecordDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { users } = useAuth0Users();

  const [record, setRecord] = useState<RecordOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<RecordOut>>({});

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/records/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch record");
        }
        const data = await response.json();
        setRecord(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      const updatedRecord = await response.json();
      setRecord(updatedRecord);
      setSuccess(true);
      setEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
          Record not found
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Record Details</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Navigation */}
          <div className="mb-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to List
            </Link>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              Record updated successfully
            </div>
          )}

          {/* Main content */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Record Details
              </h1>
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded-md ${
                  editing
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{record.question}</p>
                  )}
                </div>

                {/* Question Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.questionDescription || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          questionDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {record.questionDescription || "No description"}
                    </p>
                  )}
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.answer || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-md border-gray-300 shadow-sm"
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {record.answer || "No answer provided"}
                    </p>
                  )}
                </div>

                {/* Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  {editing ? (
                    <select
                      value={formData.assignedTo || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedTo: e.target.value })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.user_id} value={user.email}>
                          {user.name || user.email}
                        </option>
                      ))}
                    </select>
                  ) : record.assignedTo ? (
                    <UserChip
                      user={users.find((u) => u.email === record.assignedTo)!}
                    />
                  ) : (
                    <UnassignedChip />
                  )}
                </div>

                {/* Properties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Properties
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.properties || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, properties: e.target.value })
                      }
                      placeholder="key1:value1,key2:value2"
                      className="w-full rounded-md border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="space-y-1">
                      {record.properties &&
                        record.properties.split(",").map((prop, index) => {
                          const [key, value] = prop.split(":");
                          return (
                            <div
                              key={index}
                              className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 rounded-md text-sm"
                            >
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="border-t pt-4 mt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      Created by: {record.createdBy}
                      <br />
                      Created at: {new Date(record.createdAt).toLocaleString()}
                    </div>
                    <div>
                      Updated by: {record.updatedBy || "N/A"}
                      <br />
                      Updated at:{" "}
                      {record.updatedAt
                        ? new Date(record.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                {editing && (
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`px-4 py-2 rounded-md bg-blue-600 text-white ${
                        saving
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }`}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordDetails;

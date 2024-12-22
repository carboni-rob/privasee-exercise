import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import Modal from "@/components/Modal";
import RecordForm from "@/components/RecordForm";
import { RecordOut } from "@privasee/types";
import RecordList from "@/components/RecordsList";
import { useUsers } from "@/services/auth0";

const Home: NextPage = () => {
  const [records, setRecords] = useState<RecordOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users = useUsers();
  console.log(users);

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/records");
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await response.json();
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <Head>
        <title>Privasee Exercise</title>
        <meta name="description" content="GDPR Q&A Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-3">
            <h1>GDPR Q&A Platform</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">CAIQ</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Question
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex space-x-4 ml-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Owners (2)
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Status (4)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-4">
            <RecordList records={records} loading={loading} error={error} />
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Question"
      >
        <RecordForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchRecords();
          }}
        />
      </Modal>
    </div>
  );
};

export default Home;

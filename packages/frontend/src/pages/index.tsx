import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import RecordForm from "@/components/RecordForm";
import Modal from "@/components/Modal";

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Question"
      >
        <RecordForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Home;

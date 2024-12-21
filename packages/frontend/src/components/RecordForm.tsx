import React, { useState } from "react";
import { RecordIn, PropertyPair } from "@privasee/types";
import PropertyInput from "./PropertyInput";

const RecordForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<RecordIn>>({
    question: "",
    properties: "",
    questionDescription: "",
  });
  const [propertyPairs, setPropertyPairs] = useState<PropertyPair[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const formatProperties = (pairs: PropertyPair[]): string => {
    return pairs
      .filter((pair) => pair.key && pair.value) // Only include pairs with both key and value
      .map((pair) => `${pair.key}:${pair.value}`)
      .join(",");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Format properties before sending
      const dataToSend = {
        ...formData,
        properties: formatProperties(propertyPairs),
      };

      const response = await fetch("http://localhost:3001/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to create record");
      }

      const data = await response.json();
      console.log("Record created:", data);
      setSuccess(true);

      // Reset form
      setFormData({
        question: "",
        properties: "",
        questionDescription: "",
      });
      setPropertyPairs([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handlePropertyChange = (
    index: number,
    field: keyof PropertyPair,
    value: string
  ) => {
    const updatedProperties = [...propertyPairs];
    updatedProperties[index] = {
      ...updatedProperties[index],
      [field]: value,
    };
    setPropertyPairs(updatedProperties);
  };

  const handleAddProperty = () => {
    setPropertyPairs([...propertyPairs, { key: "", value: "" }]);
  };

  const handleRemoveProperty = (index: number) => {
    const updatedProperties = [...propertyPairs];
    updatedProperties.splice(index, 1);
    setPropertyPairs(updatedProperties);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-6">Create New Question</h2>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          Question created successfully!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700"
          >
            Question *
          </label>
          <input
            type="text"
            id="question"
            required
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            Answer
          </label>
          <textarea
            id="answer"
            value={formData.answer || ""}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="questionDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Question Description
          </label>
          <textarea
            id="questionDescription"
            value={formData.questionDescription || ""}
            onChange={(e) =>
              setFormData({ ...formData, questionDescription: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Properties
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Properties will be stored as &quot;key1:value1,key2:value2&quot;
          </div>
          {propertyPairs.map((property, index) => (
            <PropertyInput
              key={index}
              property={property}
              index={index}
              onChange={handlePropertyChange}
              onRemove={handleRemoveProperty}
            />
          ))}
          <button
            type="button"
            onClick={handleAddProperty}
            className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Property
          </button>
        </div>

        {propertyPairs.length > 0 && (
          <div className="text-sm text-gray-500">
            Preview: {formatProperties(propertyPairs)}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Create Record
        </button>
      </div>
    </form>
  );
};

export default RecordForm;

import React from "react";
import { PropertyPair } from "@privasee/types";

interface PropertyInputProps {
  property: PropertyPair;
  index: number;
  onChange: (index: number, field: keyof PropertyPair, value: string) => void;
  onRemove: (index: number) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  property,
  index,
  onChange,
  onRemove,
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="Key"
        value={property.key}
        onChange={(e) => onChange(index, "key", e.target.value)}
        className="flex-1 rounded-md border-gray-300"
      />
      <input
        type="text"
        placeholder="Value"
        value={property.value}
        onChange={(e) => onChange(index, "value", e.target.value)}
        className="flex-1 rounded-md border-gray-300"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
};

export default PropertyInput;

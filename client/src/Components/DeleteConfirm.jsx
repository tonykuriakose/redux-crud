import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md">
        <p className="text-lg font-semibold mb-4">Are you sure you want to delete?</p>
        <div className="flex justify-end">
          <button className="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

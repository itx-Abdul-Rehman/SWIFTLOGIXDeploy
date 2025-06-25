import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const SubmitButton = () => {
  const [status, setStatus] = useState("idle"); // idle | processing | success

  const handleSubmit = async () => {
    setStatus("processing");

    // Simulate API delay
    setTimeout(() => {
      setStatus("success");
    }, 3000); // Change to your actual API response handler
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={status === "processing"}
      className="relative overflow-hidden bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center min-w-[180px] transition-all duration-300"
    >

      {/* ✅ Left Checkmark after success */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-[50%]"
          >
            <FaCheck className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌀 Circle animation during processing */}
      <AnimatePresence>
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            className="absolute right-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
          />
        )}
      </AnimatePresence>

      {/* Button Text */}
      <span className="ml-6 py-2">
        {status === "processing" ? "Processing..." : status === "success" ? "" : "Submit"}
      </span>
    </button>
  );
};

export default SubmitButton;

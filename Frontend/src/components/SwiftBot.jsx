import { Webchat } from '@botpress/webchat';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import botAvtar from './icons/assistant.png';

function SwiftBot() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => setIsWebchatOpen(prev => !prev);

  const configuration = {
    botName: 'SWIFTBOT',
    botAvatar: botAvtar,
    variant: 'solid',
    color: '009688',
    showPoweredBy: false,
    radius: 2,
    fontFamily: 'inter'
  };

  return (
    <>
      <AnimatePresence>
        {isWebchatOpen && (
          <motion.div
            key="webchat"
            initial={{ x: 300, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 300, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              width: '90vw',
              maxWidth: '400px',
              height: '80vh',
              maxHeight: '600px',
              position: 'fixed',
              bottom: '110px',
              right: '20px',
              zIndex: 50,
              display: 'flex',
              boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
              borderRadius: '1rem',
              overflow: 'hidden',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Webchat
              clientId="21aef817-dd6b-4b33-a993-8f38e60acb72"
              configuration={configuration}
              className="z-50 w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
          <motion.div
            key="toggle-icon"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '20px',
              zIndex: 50
            }}
          >
            <motion.img
              className="w-12 sm:w-16 cursor-pointer"
              src={botAvtar}
              onClick={toggleWebchat}
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 1.8 }
              }}
              alt="Chatbot Toggle"
            />
          </motion.div>
      </AnimatePresence>
    </>
  );
}

export default SwiftBot;

import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // For typing indicator
  const chatBodyRef = useRef(null);

  // Predefined responses to common questions
  const predefinedResponses = {
    "hi": "Hello! How can I assist you today?",
    "HI": "Hello! How can I assist you today?",
    
    "What is this project about?": "This is a flight booking system where users can search for flights, book tickets, manage their bookings, and more.",
    "How can I register?": "You can register by clicking on the 'Sign Up' button on the homepage.",
    "What is the contact information?": "You can contact us via the 'Contact Us' section in the footer.",
    "What are the payment options?": "We support various payment methods including credit cards and PayPal.",
    "How do I view my booking history?": "You can view your booking history by going to the 'My Bookings' section in your dashboard.",
    "How do I add money to my wallet?": "You can add money to your wallet by going to the 'Wallet' section in your dashboard and clicking on the 'Add Money' button.",
    "What is the balance in my wallet?": "You can check your wallet balance in the 'Wallet' section of your dashboard.",
    // Add more predefined responses here
  };

  // Handle sending messages and getting responses
  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessage = { sender: "user", text: userInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserInput(""); // Clear input field

      // Simulate typing delay for the bot
      setIsTyping(true);
      const responseText =
        predefinedResponses[userInput.trim()] ||
        "Sorry, I didn't understand that. Can you ask another question?";

      setTimeout(() => {
        const botMessage = { sender: "bot", text: responseText };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Handle key press (Enter key)
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll chat body to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle chat visibility
  const toggleChatBox = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div>
      <button className="chat-toggle-btn" onClick={toggleChatBox}>
        {showChat ? "Close Chat" : "Chat with us"}
      </button>
      {showChat && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Chat with us</h3>
            <button onClick={toggleChatBox}>Close</button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message">
                <span className="typing-indicator">...</span>
              </div>
            )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
            />
            <button onClick={handleSendMessage} disabled={!userInput.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

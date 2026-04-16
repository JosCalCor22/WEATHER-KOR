import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../env/const';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface Props {
  weatherData: any;
  forecastData: any;
}

const WeatherChat = ({ weatherData, forecastData }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am your weather assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      // Using 1.5-flash as 2.5 is not a valid model ID yet
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const weatherContext = weatherData ? `
        The current weather in ${weatherData.name} is:
        - Temperature: ${Math.round(weatherData.main.temp)}°C
        - Description: ${weatherData.weather[0].description}
        - Humidity: ${weatherData.main.humidity}%
      ` : "No current weather data available.";

      const forecastContext = forecastData ? `
        Forecast for the next few days in ${weatherData.name}:
        ${forecastData.list.slice(0, 5).map((f: any) =>
        `- ${f.dt_txt}: ${Math.round(f.main.temp)}°C, ${f.weather[0].description}`
      ).join('\n')}
      ` : "No forecast data available.";

      const prompt = `You are a helpful weather assistant. Use the following context to answer the user's question concisely and politely. 
      Always end with a follow-up question to keep the conversation going, and avoid repeating the same question twice.
      If the user change the language, respond in the same language.
      
      CONTEXT:
      ${weatherContext}
      ${forecastContext}

      User question: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now. Please check your API key!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-morphism rounded-[2.5rem] p-8 text-white h-[600px] w-full max-w-[450px] flex flex-col animate-fade-in transition-all duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Have any question?
      </h2>

      {/* Messages Container */}
      <div className="weather-chat-container flex flex-col gap-3 flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`message-div max-w-[85%] p-4 rounded-lg text-sm ${msg.role === 'user'
                ? 'bg-black/30 backdrop-blur-md border border-white/10' // Darker glass
                : 'bg-white/20 backdrop-blur-md border border-white/20' // Softer glass
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/10 p-4 rounded-2xl text-sm">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="chat-input w-full bg-white/20 border border-white/30 backdrop-blur-sm rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="chat-btn border-2 border-white/10 hover:bg-white/10 disabled:opacity-50 rounded-lg cursor-pointer transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="font-bold">Send</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default WeatherChat;

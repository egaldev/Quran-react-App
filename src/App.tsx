import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Surah from "./pages/Surah";
import NotFound from "./pages/NotFound";
import Doa from "./pages/Doa";
import ChatbotPage from "./pages/Chatbot.jsx";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:nomor" element={<Surah />} />
          <Route path="/doa" element={<Doa />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

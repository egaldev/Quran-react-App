import { Moon, Sun, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onOpenModal }: { onOpenModal?: () => void }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm mb-16">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Al-Qur'an Digital</h1>
              <p className="text-xs text-muted-foreground">Baca & Dengarkan</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* 🔥 Tombol Doa-Doa */}
            <Link to="/doa">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-muted"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Doa-Doa</span>
              </Button>
            </Link>

            {/* Tombol chatBot */}
            <Link to="/chat">
              <Button variant="ghost" size="sm">Chat</Button>
            </Link>


            {/* Tombol Kelompok */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenModal}
              className="gap-2 hover:bg-muted"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Kelompok</span>
            </Button>

            {/* Tombol Dark Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-muted"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-accent" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

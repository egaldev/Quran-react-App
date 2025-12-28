import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            variant="secondary"
            className="
        fixed bottom-8 right-6 z-50 rounded-full shadow-lg
        bg-primary text-primary-foreground hover:bg-primary/80
        animate-fade-in
      "
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
};

export default ScrollToTopButton;

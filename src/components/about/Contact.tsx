
import { Button } from "@/components/ui/button";
import { Phone, Mail, Instagram, Facebook, Github } from "lucide-react";

const Contact = () => {
  return (
    <section className="text-center">
      <Button className="bg-tgwing-600 hover:bg-tgwing-700 text-white text-lg px-8 py-6 rounded-full mb-8">
        지금 가입하기
      </Button>
      <div className="flex justify-center gap-4 text-white">
        <a href="mailto:contact@tgwing.com" className="hover:text-tgwing-200">
          <Mail className="w-6 h-6" />
        </a>
        <a href="tel:010-1234-5678" className="hover:text-tgwing-200">
          <Phone className="w-6 h-6" />
        </a>
        <a href="https://instagram.com/tgwing" className="hover:text-tgwing-200">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="https://facebook.com/tgwing" className="hover:text-tgwing-200">
          <Facebook className="w-6 h-6" />
        </a>
        <a href="https://github.com/tgwing" className="hover:text-tgwing-200">
          <Github className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default Contact;

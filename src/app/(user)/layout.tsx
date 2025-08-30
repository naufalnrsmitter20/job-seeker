import "@/app/globals.css";
import { Navigation } from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

import "@/app/globals.css";
import { Navigation } from "../_components/Navigation";
import Footer from "../_components/Footer";

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

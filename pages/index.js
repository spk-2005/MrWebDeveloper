
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbar2 from "./components/Navbar2";
import { useState, useEffect } from "react"; // Import useEffect
import Sidenavbar from "./components/Sidenavbar";
import Contentpage from "./components/Contentpage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('HTML');
  // New state to track the active sub-item
  const [activeItem, setActiveItem] = useState(sidebarData['HTML'][0]); // Default to first HTML item

  // Effect to update activeItem when activeSection changes
  useEffect(() => {
    if (activeSection && sidebarData[activeSection] && sidebarData[activeSection].length > 0) {
      setActiveItem(sidebarData[activeSection][0]); // Set to the first item of the new activeSection
    }
  }, [activeSection]); // Re-run this effect whenever activeSection changes

  return (
    <>
      <Navbar />
      <Navbar2 activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex min-h-[calc(100vh-100px)]">
        <Sidenavbar
          activeSection={activeSection}
          activeItem={activeItem} // Pass activeItem
          setActiveItem={setActiveItem} // Pass setter for activeItem
        />

        <main className="flex-grow ">
          <Contentpage activeSection={activeSection} activeItem={activeItem} className='w-20'/>
        </main>
      </div>

      <Footer />
    </>
  );
}
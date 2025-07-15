

export default function Contentpage({ activeSection, activeItem }) {

  return (
    <div className="bg-white p-6 shadow-md  min-h-[500px] w-210">
  
          <p>Selected: {activeSection} - {activeItem}</p>
          </div>
  );
}
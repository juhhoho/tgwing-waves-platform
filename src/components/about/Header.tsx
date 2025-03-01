
const Header = () => {
  return (
    <section className="text-center mb-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">TGWing</h1>
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/4a5e0136-fa69-4d89-a1ee-b42ee2a95138.png" 
          alt="TGWing Logo" 
          className="h-48 object-contain" 
        />
      </div>
      <p className="text-xl text-gray-600 mb-6">"The Greatest WavING"</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="bg-gray-100 rounded-lg px-6 py-3 text-gray-800">
          1972년 창립
        </div>
        <div className="bg-gray-100 rounded-lg px-6 py-3 text-gray-800">
          웹/앱 개발
        </div>
      </div>
    </section>
  );
};

export default Header;

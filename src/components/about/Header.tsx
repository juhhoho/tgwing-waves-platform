
const Header = () => {
  return (
    <section className="text-center mb-16">
      <h1 className="text-4xl font-bold text-white mb-6">TGWing</h1>
      <div className="flex justify-center mb-6">
        <img src="https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/wave.png" alt="TGWing Logo" style={{ width: "800px", height: "400px" }} />
      </div>
      <p className="text-xl text-white mb-6">"The Greatest WavING"</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          1972년 창립
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          웹/앱 개발
        </div>
      </div>
    </section>
  );
};

export default Header;

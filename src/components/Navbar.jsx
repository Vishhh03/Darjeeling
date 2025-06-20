export default function Navbar() {
  return (
    <div className="absolute w-full top-0 z-50 px-4 backdrop-blur-xs shadow-md">
      <div className="sticky top-4 mx-auto flex justify-between items-center
                      md:w-2/3 px-6 py-4  
                      text-white ">
        {/* Logo */}
        <div className="font-bold text-lg tracking-wide">
          <a href="/">DARJEELING LUXURY</a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 font-semibold text-sm">
          <a href="#">GALLERY</a>
          <a href="#">LOCATION</a>
          <a href="#">ABOUT US</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 text-sm">
          <button className="border border-white text-white font-semibold px-4 py-2 rounded-full">
            VIEW BROCHURE
          </button>
          <button className="bg-white text-black font-semibold px-4 py-2 rounded-full">
            CONTACT US
          </button>
        </div>
      </div>
    </div>
  );
}

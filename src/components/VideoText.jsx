export default function VideoText({ startAction }) {

return(
    <div className="relative z-10 px-6 md:px-36 pt-52 md:pt-40 max-w-4xl">
        {/* Headline */}
        <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight">
          Darjeeling Luxury <br />
          Resort Getaway
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-lg md:text-2xl text-white/100 font-light">
          A peaceful retreat surrounded by nature in the heart of Darjeeling. Luxury meets tranquility.
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={startAction}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow hover:bg-opacity-90 transition"
          >
            View Container
          </button>
        </div>

        {/* Location */}
        <div className="mt-6 flex items-center gap-2 text-white text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          Darjeeling, Hyderabad, India
        </div>

        {/* Distance Info Bar */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-white text-sm md:text-base font-medium border-t border-white/30 pt-4 max-w-2xl">
          <div>
            <p className="text-2xl font-bold">0.2 km</p>
            <p>to shops</p>
          </div>
          <div>
            <p className="text-2xl font-bold">3 km</p>
            <p>to city center</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0.3 km</p>
            <p>to tea gardens</p>
          </div>
        </div>
      </div>
)

};
import pic1 from "./assets/aboutpic1.png";
import pic2 from "./assets/aboutpic2.png";
import pic3 from "./assets/aboutpic3.jpg";
import cloud from "./assets/cloudimg1.png";
import pic4 from "./assets/aboutpic4.png";
import pic5 from "./assets/aboutpic5.png";
import right from "./assets/aboutpic51.png";
import handeshack from "./assets/aboutpic52.png";
import help1 from "./assets/helppic1.png";
import help2 from "./assets/helppic2.png";
import help3 from "./assets/helppic3.png";
import help4 from "./assets/helppic4.png";
import mainpic from "./assets/helpmainpic.png";

function About() {
  return (
    <>
      <section className="bg-[#FF9F1C] ">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4  flex-wrap">
          {/* Left Image */}
          <img
            src={pic1}
            alt="Left Kid"
            className="w-16 sm:w-20 md:w-40 lg:w-96 h-auto"
          />

          {/* Center Text */}
          <div className="text-center text-white px-2 flex-1 min-w-[180px]">
            <h1 className="text-[10px] sm:text-[20px] md:text-[22px] font-bold">
              ESIKSHAMITRA
            </h1>
            <h2 className="text-[8px] sm:text-[20px] md:text-[16px] lg:text-[24px] font-semibold mt-1">
              A NEW APPROACH TO STUDY
            </h2>
            <p className="mt-2 text-[#146192] font-semibold text-[6px] sm:text-[10px] md:text-[12px] lg:text-[16px] leading-snug">
              "Your gateway to discovering schools, applying for admissions, and
              preparing for entrance exams—all in one place".
            </p>
          </div>

          {/* Right Image */}
          <img
            src={pic2}
            alt="Right Kid"
            className="w-16 sm:w-20 md:w-40 lg:w-96 h-auto"
          />
        </div>
      </section>

      <section className="bg-[#fef9f4] py-8 px-2 pb-[80px]">
        <div className="max-w-6xl mx-auto text-center pb-12">
          {/* Title & Description */}
          <h2 className="text-lg md:text-3xl font-semibold text-[#146192] uppercase">
            About Eshikshamitra
          </h2>
          <p className="mt-2 text-sm md:text-lg text-[#656565] max-w-2xl mx-auto font-semibold">
            Shikshamitra is your trusted partner in finding the best school for
            your child from Class 1 to 12. Our platform provides verified school
            listings, reviews, and admission guidance.
          </p>

          {/* Three Columns Section */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
            {/* Mission */}
            <div className="border-2 border-orange-400 p-4 md:p-6 w-[300px] md:w-1/3 h-[200px] md:h-[240px] text-center bg-white shadow-sm">
              <p className="text-lg md:text-2xl font-semibold text-[#146192] mb-2">
                OUR MISSION
              </p>
              <p className="text-sm md:text-lg text-gray-700 mt-4 font-semibold px-4 md:px-8">
                “To make school search and admission easier, transparent, and
                accessible for every family.”
              </p>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/3">
              <img
                src={pic3}
                alt="Two Kids with Books"
                className="w-[280px] md:w-[350px] h-[120px] md:h-[240px] rounded-lg shadow-md mx-auto "
              />
            </div>

            {/* Vision */}
            <div className="border-2 border-orange-400 p-4 md:p-6 w-[300px] md:w-1/3 h-[200px] md:h-[240px] text-center bg-white shadow-sm">
              <p className="text-lg md:text-2xl font-semibold text-[#146192] mb-2">
                OUR VISION
              </p>
              <p className="text-sm md:text-lg text-gray-700 mt-4 font-semibold px-4 md:px-6">
                We envision a future where every child finds the right
                educational environment to thrive in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* test image */}

      <div>
        {/* Top Cloud */}
        <img
          src={cloud}
          alt="Cloud Top"
          className="w-full  h-auto -mt-[110px]"
        />

        {/* Director's Message */}
        <section className="bg-orange-400 text-white py-8 px-6 rounded-tr-3xl rounded-bl-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center shadow-lg mb-[100px]">
          <img
            src={pic4}
            alt="Director"
            className="w-34 h-24  object-cover mr-6 mb-4 md:mb-0 "
          />
          <div>
            <h3 className="text-lg md:text-2xl  uppercase">
              Our Director's Message
            </h3>
            <h4 className="text-md md:text-lg font-semibold mt-1">
              A Vision for the Future
            </h4>
            <p className="text-sm md:text-base mt-2">
              Dear Students, Parents, and Educators. We are committed to
              transforming education through innovative technology. Together, we
              can create a brighter future for our students.
            </p>
          </div>
        </section>

        {/* Bottom Cloud */}

        {/* Blue Section: What We Do */}
        <section className="bg-[#1c3a5f] text-white py-12  text-center pb-[190px]">
          <img
            src={cloud}
            alt="Cloud Bottom"
            className="w-full h-auto -mt-[110px] "
          />
          <h2 className="text-3xl font-slabserif font-semibold mb-10 uppercase">
            What We Do
          </h2>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="md:border-r-2 border-dotted border-[#FF9F1C] pr-4">
              <h4 className="text-[#FF9F1C] font-semibold mb-2">
                ● School Discovery
              </h4>
              <p className="text-sm">
                We help parents explore and compare schools based on location,
                curriculum, fees, and reviews.
              </p>
            </div>

            {/* Card 2 */}
            <div className="md:border-r-2 border-dotted border-[#FF9F1C] px-4">
              <h4 className="text-[#FF9F1C] font-semibold mb-2">
                ● Admission Guidance
              </h4>
              <p className="text-sm">
                We provide up-to-date admission timelines and application
                resources.
              </p>
            </div>

            {/* Card 3 */}
            <div className="md:border-r-2 border-dotted border-[#FF9F1C] px-4">
              <h4 className="text-[#FF9F1C] font-semibold mb-2">
                ● Verified Reviews
              </h4>
              <p className="text-sm">
                Real feedback from other parents to help you make informed
                choices.
              </p>
            </div>

            {/* Card 4 (last one - no right border) */}
            <div className="pl-4">
              <h4 className="text-[#FF9F1C] font-semibold mb-2">
                ● Smart Filter & Comparison
              </h4>
              <p className="text-sm">
                Filter by board, facilities, and fee range, compare multiple
                schools side by side.
              </p>
            </div>
          </div>
        </section>
        <img
          src={cloud}
          alt="Cloud Bottom"
          className="w-full h-auto -mt-[100px] "
        />
      </div>
      <section className="bg-[#FF9F1C] text-white py-10 px-4 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-4">
        {/* Left Side - Text Content */}
        <div className="space-y-4 pl-[160px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold flex items-center gap-2 text-[#146192]">
            <img
              src={right}
              alt="Star"
              className="w-8 sm:w-10 md:w-11 h-auto"
            />
            WHY TRUST US
          </h2>
          <div className="flex-1 flex justify-center block sm:hidden ">
            <img src={pic5} alt="Illustration" className="w-[200px] h-auto " />
          </div>
          <ul className="space-y-3 text-xs sm:text-sm md:text-base ">
            <li className="flex items-start gap-3">
              <img src={handeshack} alt="Icon" className="w-6 sm:w-8 h-auto" />
              <span>Curated & Verified School Listings</span>
            </li>
            <li className="flex items-start gap-3">
              <img src={handeshack} alt="Icon" className="w-6 sm:w-8 h-auto" />
              <span>Transparent, Unbiased Reviews</span>
            </li>
            <li className="flex items-start gap-3">
              <img src={handeshack} alt="Icon" className="w-6 sm:w-8 h-auto" />
              <span>Local Support for Personalized Assistance</span>
            </li>
            <li className="flex items-start gap-3">
              <img src={handeshack} alt="Icon" className="w-6 sm:w-8 h-auto" />
              <span>Backed by an Experienced Team in EdTech</span>
            </li>
          </ul>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex-1 flex justify-center hidden sm:flex">
          <img
            src={pic5}
            alt="Illustration"
            className="w-[250px] md:w-[300px] lg:w-[400px] xl:w-[500px] h-auto"
          />
        </div>
      </section>

      <section className="bg-white py-12 px-4 md:px-10 xl:px-20 flex flex-col xl:flex-row items-center gap-10">
        {/* Left Side - Text + Icons */}
        <div className="w-full xl:w-2/3 space-y-8">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-semibold text-[#146192]">
            WHO WE HELP?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base text-gray-700">
            {/* Card 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#40E492] text-white p-2 rounded">
                <img src={help1} alt="Star" className="w-8 h-8" />
              </div>
              <span className="pt-2 text-[16px] md:text-[18px]">
                Parents of children in Classes K–12
              </span>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#E4AE40] text-white p-2 rounded">
                <img src={help2} alt="Star" className="w-8 h-8" />
              </div>
              <span className="pt-2 text-[16px] md:text-[18px]">
                Students switching schools
              </span>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#4082E4] text-white p-2 rounded">
                <img src={help3} alt="Star" className="w-8 h-8" />
              </div>
              <span className="pt-2 text-[16px] md:text-[18px]">
                Families relocating to new cities
              </span>
            </div>

            {/* Card 4 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#5EE440] text-white p-2 rounded">
                <img src={help1} alt="Star" className="w-8 h-8" />
              </div>
              <span className="pt-2 text-[16px] md:text-[18px]">
                Educators and school counselors
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full xl:w-1/3 flex justify-center">
          <img
            src={mainpic}
            alt="Child playing"
            className="rounded-lg w-full max-w-[250px] sm:max-w-[300px] xl:max-w-[320px] shadow-md"
          />
        </div>
      </section>
    </>
  );
}

export default About;

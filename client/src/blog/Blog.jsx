import React from "react";
import { useState } from "react";
import Blogimg1 from "../assets/blogimg1.png";
import Blogimgmain from "../assets/blogimgmain.png";
import Blogimgleft1 from "../assets/blogimgleft1.png";
import Blogimgleft2 from "../assets/blogimgleft2.png";
import Blogimgright1 from "../assets/blogimgright1.png";
import Blogimgright2 from "../assets/blogimgright2.png";
import Blogimgtop from "../assets/blogimgtop1.png";
import Blogimgtopright2 from "../assets/blogimgtopright2.png";
import Blogimgtopright3 from "../assets/blogimgtopright3.png";
import Blogimgtopright4 from "../assets/blogimgtopright4.png";
import Blogspotimg1 from "../assets/blogspotimg1.png";
import Blogspotimg2 from "../assets/blogspotimg2.png";
import Blogspotimg3 from "../assets/blogspotimg3.png";
import Blogspotimg4 from "../assets/blogspotimg4.png";
import BlogBoy from "../assets/blogimgboy.png";

function Blog() {
  const faqs = [
    {
      question: "What is E-Sikshamitra?",
      answer:
        "Sikshamitra is a one-stop platform that provides detailed information about schools. It allows parents and students to search for schools, compare them, apply online, apply offline and even appear for entrance exams — all through a single website.",
    },
    {
      question: "Who can use ESikshamitra?",
      answer: "Any parent, student or guardian looking for school admissions.",
    },
    {
      question: "How do I apply to a school through Esikshamitra?",
      answer:
        "You can browse schools, fill out the application, and submit it online or offline through the platform.",
    },
    {
      question: "How do I take the entrance exam?",
      answer:
        "The platform will guide you with a schedule and either online or offline options for exams.",
    },
    {
      question: "Is my data safe on ESikshamitra?",
      answer:
        "Yes, your data is securely encrypted and follows data protection protocols.",
    },
    {
      question: "Can I edit my application after submission?",
      answer:
        "Editing is allowed before the final submission deadline of the school.",
    },
    {
      question: "How will I know if my child is selected?",
      answer:
        "You will receive a notification via email or SMS once the selection list is out.",
    },
    {
      question: "Do I have to appear in person for the entrance exam?",
      answer:
        "It depends on the school's requirements. The platform will mention whether it's online or offline.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="xl:min-w-[1440px] bg-[#FF9F1C] -mt-4 xl:-mt-6 flex flex-col xl:flex-row overflow-hidden max-w-full">
        <div className="p-4 xl:p-0 text-white xl:flex xl:flex-col xl:justify-center xl:ml-[69px] xl:w-[50%]">
          <h3 className="xl:text-[68px] md:text-[50px] font-medium text-2xl grid xl:grid xl:justify-start">
            <span className="block xl:mt-6 md:mt-4">OUR</span>
            <span className="block xl:mt-10 md:mt-4">BLOGS</span>
          </h3>
        </div>

        <div className="xl:w-[600px] xl:h-[262px] flex justify-start md:justify-end xl:translate-y-10 translate-y-6">
          <img
            src={Blogimg1}
            alt="Blogimg1"
            className="xl:max-w-full xl:h-auto h-[200px] xl:ml-0 ml-4 max-w-full"
          />
        </div>
      </section>

      <section className="mt-[30px]" style={{ fontFamily: "Poppins" }}>
        <h1 className="text-center text-xl md:text-2xl lg:text-3xl xl:text-[43px] font-semibold text-[#1982C4]">
          TRENDING
        </h1>
        <div className="lg:flex mx-4 lg:mx-10 xl:mx-0 py-6 xl:py-10">
          <div className="space-y-4 xl:px-10 xl:ml-[80px] md:px-4">
            <div className="relative">
              <img
                src={Blogimgmain}
                alt="School facility entrance"
                className="w-full h-[300px] lg:h-full object-fill rounded-lg xl:h-[611px] xl:w-[649px]"
              />
              <label className="absolute bottom-0 left-0 right-0 bg-[#FFFFFF] opacity-80 px-4 xl:w-[500px] py-2 text-xs md:text-md lg:text-lg">
                "Effective Strategies for Enhancing Parent-Teacher
                Communication"
              </label>
            </div>

            <div className="grid grid-cols-2 xl:py-10 gap-4">
              <div className="relative">
                <img
                  src={Blogimgleft1}
                  alt="School facility entrance"
                  className="w-full h-[300px] lg:h-full xl:h-[273px] xl:w-[315px] object-fill rounded-lg"
                />
                <label className="absolute bottom-0 left-0 right-0 bg-[#FFFFFF] opacity-80 px-4 xl:w-[300px] py-2 text-xs md:text-md lg:text-lg">
                  "Effective Strategies for Enhancing Parent-Teacher
                  Communication"
                </label>
              </div>
              <div className="relative">
                <img
                  src={Blogimgleft2}
                  alt="School facility entrance"
                  className="w-full h-[300px] lg:h-full xl:h-[273px] xl:w-[315px] object-fill rounded-lg"
                />
                <label className="absolute bottom-0 left-0 right-0 bg-[#FFFFFF] opacity-80 px-4 xl:w-[300px] py-2 text-xs md:text-md lg:text-lg">
                  "Effective Strategies for Enhancing Parent-Teacher
                  Communication"
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols py-4 lg:py-0 mx-4">
            <div className="relative">
              <img
                src={Blogimgright1}
                alt="School facility entrance"
                className="w-full h-[300px] lg:h-full xl:w-[576px] xl:h-[448px] object-fill rounded-lg"
              />
              <label className="absolute bottom-0 xl:bottom-6 left-0 right-0 bg-[#FFFFFF] opacity-80 px-4 xl:w-[500px] py-2 text-xs md:text-md lg:text-lg">
                "Effective Strategies for Enhancing Parent-Teacher
                Communication"
              </label>
            </div>
            <div className="relative py-4 ">
              <img
                src={Blogimgright2}
                alt="School facility entrance"
                className="w-full h-[300px] lg:h-full xl:w-[576px] xl:h-[448px] object-fill rounded-lg"
              />
              <label className="absolute bottom-4 xl:bottom-10 left-0 right-0 bg-[#FFFFFF] opacity-80 px-4 xl:w-[500px] py-2 text-xs md:text-md lg:text-lg">
                "Effective Strategies for Enhancing Parent-Teacher
                Communication"
              </label>
            </div>
          </div>
        </div>

        <div className=" mx-4 lg:mx-10 xl:mx-0 py-6 xl:py-10">
          <div className="space-y-4 xl:px-10 xl:ml-[80px] xl:mr-[80px] md:px-4 md:flex md:justify-around">
            <div>
              <h1 className="text-lg font-medium xl:text-[47px] md:text2xl text-[#1982C4]">
                TOP CATEGORIES
              </h1>
              <hr className="my-4 border-black xl:w-[800px]" />
              <div className="lg:grid lg:grid-cols-2">
                <div>
                  <img src={Blogimgtop} alt="Blogimgtop" />
                  <h1 className="xl:text-[25px] font-semibold xl:w-[390px] lg:text-md py-2">
                    "Creative Approaches to Student Engagement: Beyond the
                    Classroom"
                  </h1>
                  <label className="font-extralight xl:text-[23px] ">
                    Integrate Personal Interests: Connect curriculum topics to
                    students' hobbies and passions to enhance motivation and
                    relevance in learning.
                  </label>
                </div>
                <div className="lg:px-4 py-4 lg:py-0">
                  <div>
                    <img src={Blogimgtopright2} alt="Blogimgtopright2" />
                    <label className="text-xs lg:text-lg">
                      "The Role of Arts Education in Fostering Creativity and
                      Innovation"
                    </label>
                  </div>
                  <div className="py-4">
                    <img src={Blogimgtopright3} alt="Blogimgtopright2" />
                    <label className="text-xs lg:text-lg">
                      "The Role of Arts Education in Fostering Creativity and
                      Innovation"
                    </label>
                  </div>
                  <div className="py-4 ">
                    <img src={Blogimgtopright4} alt="Blogimgtopright2" />
                    <label className="text-xs lg:text-lg">
                      "The Role of Arts Education in Fostering Creativity and
                      Innovation"
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:flex gap-6">
                <div>
                  <img
                    src={BlogBoy}
                    alt="BlogBoy"
                    className="w-full md:w-auto object-fill"
                  />
                </div>
                <div
                  className="bg-[#1982C4] xl:py-14 text-white xl:px-10 xl:w-[550px] md:w-[400px] p-4"
                  style={{ fontFamily: "Poppins" }}
                >
                  <div className="mb-4">
                    <h1
                      className="text-sm bg-white text-[#1982C4] font-bold px-4 py-1 rounded-full inline-block"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      TOP RATED
                    </h1>
                  </div>
                  <h1 className="font-semibold">
                    "Creative Approaches to Student Engagement: Beyond the
                    Classroom"
                  </h1>
                  <p className="lg:py-10 text-xs font-extralight xl:text-lg">
                    Creative approaches to student engagement beyond the
                    classroom involve innovative strategies that enhance
                    learning experiences. By integrating students' personal
                    interests and passions into lessons, educators can make
                    learning more relevant and exciting. Additionally,
                    experiential learning opportunities, such as field trips and
                    community projects, provide hands-on experiences that
                    connect classroom knowledge to real-world applications,
                    fostering deeper understanding and engagement.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-2 border-black border-t-0 w-full p-4">
              <p className="text-lg font-semibold xl:text-[30px] text-[#1982C4] text-center xl:-translate-y-8 bg-blur">
                SPOTLIGHT
              </p>
              <div className="">
                <div className="px-4">
                  <img
                    src={Blogspotimg1}
                    alt="Blogimgtopright2"
                    className="rounded-lg pb-2"
                  />
                  <label className="text-xs font-light">
                    "The Role of Arts Education in Fostering Creativity and
                    Innovation"
                  </label>
                </div>
                <div className="px-4">
                  <img
                    src={Blogspotimg2}
                    alt="Blogimgtopright2"
                    className="rounded-lg pb-2"
                  />
                  <label className="text-xs font-light">
                    "The Role of Arts Education in Fostering Creativity and
                    Innovation"
                  </label>
                </div>
                <div className="px-4">
                  <img
                    src={Blogspotimg3}
                    alt="Blogimgtopright2"
                    className="rounded-lg pb-2"
                  />
                  <label className="text-xs font-light">
                    "The Role of Arts Education in Fostering Creativity and
                    Innovation"
                  </label>
                </div>
                <div className="px-4">
                  <img
                    src={Blogspotimg4}
                    alt="Blogimgtopright2"
                    className="rounded-lg pb-2 "
                  />
                  <label className="text-xs font-light">
                    "The Role of Arts Education in Fostering Creativity and
                    Innovation"
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto my-10 px-4">
          <h2 className="text-center text-2xl font-bold text-[#0a4c92] mb-6">
            FAQ's
          </h2>
          <div className="space-y-4 w-full">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-md bg-white shadow">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-[#f7931e] font-medium focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;

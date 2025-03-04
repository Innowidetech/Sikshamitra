import React from 'react'
import HomeImg from './assets/homeimg1.png';
import HomeImg2 from './assets/homeimg2.png';
import ApplyImg from './assets/apply.png';
import RequestImg from './assets/request.png';
import SubmitImg from './assets/submit.png';
import School from './assets/school.png';
import Communication from './assets/communication.png';
import Data from './assets/datadriven.png';
import Education from './assets/education.png';
import HomeBlogimg2 from './assets/homeblog2.png';
import HomeBlogimg1 from './assets/homeblog1.png';
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import Testimonial1 from './assets/testimonial1.png';
import Testimonial2 from './assets/testimonial2.png';
import Testimonial3 from './assets/testimonial3.png';



function Home() {

    const blogs = [
        {
            img: HomeBlogimg1,
            alt: 'Blog 1',
            heading: 'The Importance of Effective Communication in Schools',
            description: 'Learn how communication between teachers, students, and parents fosters a strong learning environment.',
            link: '#'
        },
        {
            img: HomeBlogimg2,
            alt: 'Blog 2',
            heading: 'Personalized Learning Strategies',
            description: 'Discover strategies for tailoring learning to each student\'s individual needs.',
            link: '#'
        }
    ];

    return (
        <>
            <section className="mt-[25px] lg:h-[737px] w-full overflow-hidden border rounded-2xl shadow-[0px_2px_rgba(0,0,0,0.2)]">
                <div className='lg:mt-[111px] lg:ml-[73px] lg:mb-[182px] lg:min-h-[444px] lg:min-w-[615px] md:flex'>
                    <div style={{ fontFamily: 'Poppins' }} className='flex flex-col ml-[24px] mt-[30px]'>
                        <h1 className='text-[#1982C4] grid'>
                            <span className='font-medium lg:text-[51.79px] text-[22px]'>Welcome to </span>
                            <span className='text-[#FF9F1C] lg:text-[66.96px] text-[29px] font-medium'>Sikshamitra!</span>
                        </h1>
                        <h2 className='text-[#2C2C2C] font-extralight lg:text-[25.18px] lg:w-[611px] lg:mt-[4px] text-[15px] w-[286px] '>
                            Our platform streamlines communication between teachers, students, and parents, ensuring that everyone stays informed and engaged in the learning process.
                        </h2>
                        <button className='bg-[#FF9F1C] text-white rounded-br-full rounded-tl-full  lg:w-[266px] lg:h-[72px] lg:mt-[14px] w-[152px] h-[41px] mt-[20px]'>
                            Learn More
                        </button>
                    </div>
                    <div className=''>
                        <img src={HomeImg} alt="HomeImg" className='lg:w-[631px] lg:h-[506px] lg:ml-[160px] lg:mt-[-50px] overflow-hidden object-fill mt-[40px] mb-[100px]'/>
                    </div>
                </div>
            </section>

                <div className='flex justify-center items-center lg:w-[1025px] lg:h-[282px] lg:ml-[193px] lg:mr-[222px] lg:mt-[-30px] mt-[40px]'>
                    <div className='text-center border bg-[#FF9F1C] rounded-md -translate-y-24 md:transform lg:translate-x-14 md:-translate-y-16 p-4 mx-4 lg:w-full max-w-5xl shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]'>
                        <div>
                            <h1 className='text-white lg:text-[28.07px] font-extralight lg:w-full lg:ml-0 md:text-xl'>What makes us special ?</h1>
                            <hr className='bg-white flex text-center justify-center mx-auto md:w-[100px] mt-[15px] mb-[15px] w-[110px]' />
                            <h2 className='text-lg font-thin mb-[10px] text-white lg:text-[13.72px] lg:font-medium lg:mt-[11px] md:text-xl'>Here you can review some statistics about our School</h2>
                        </div>
                        <div className='grid md:grid-cols-4 text-white lg:mt-[60px] gap-4 lg:gap-0 md:mt-[40px]'>
                            <label className='grid'>
                                <span className='text-xl font-light md:text-3xl'>112</span>
                                <span className='text-xs font-light md:mt-[10px] lg:mt-0'>Certified Teachers</span>
                            </label>
                            <label className='grid'>
                                <span className='text-xl font-light md:text-3xl'>282,673</span>
                                <span className='text-xs font-light md:mt-[10px] lg:mt-0'>Students Enrolled</span>
                            </label>
                            <label className='grid'>
                                <span className='text-xl font-light md:text-3xl '>97%</span>
                                <span className='text-xs font-light md:mt-[10px] lg:mt-0'>Passing to Universities</span>
                            </label>
                            <label className='grid'>
                                <span className='text-xl font-light md:text-3xl'>100%</span>
                                <span className='text-xs font-light md:mt-[10px] lg:mt-0'>Satisfied Parents</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className='lg:mt-[10px] grid lg:flex items-center lg:w-[1259px] lg:h-[593.48px] lg:ml-[96px] lg:mr-[84.32px] mx-4 lg:mx-0 -translate-y-10 md:translate-y-0 md:ml-[40px]'>
                    <div className=''>
                        <img src={HomeImg2} alt="HomeImg2" className='lg:w-[678px] lg:h-[593.48px] md:h-full md:w-full' />
                    </div>
                    <div className='lg:w-[523px] lg:ml-[58px]' style={{ fontFamily: 'Poppins' }}>
                        <h1 className='text-center text-2xl mb-4 md:mb-0 text-[#157ABA] lg:mr-[84.56px] lg:ml-[-50px] font-medium lg:text-[53.8px] lg:mb-[30px]'>OVERVIEW</h1>
                        <label className='text-[#2C2C2C] text-sm text-wrap lg:font-light lg:text-[19.93px] lg:mr-[84.56px]'>
                            Shikshamitra is a comprehensive school management platform that enhances the educational experience for all stakeholders. It streamlines administrative tasks and promotes seamless communication among teachers, students, and parents, ensuring everyone stays informed and engaged. By supporting personalized learning journeys, Shikshamitra empowers educators to cater to individual student needs effectively.
                        </label>
                    </div>
                </div>

                <div className=' py-6 md:mt-16 md:py-10 bg-[#FF9F1C] lg:-[1440px] lg:h-[613px] mt-[20px]' style={{ fontFamily: 'Poppins' }}>
                <h1 className='text-2xl text-center text-white font-medium lg:text-[42.29px]'>ADMISSION PROCESS</h1>
                <hr className='bg-white flex text-center justify-center mx-auto mt-2 md:w-[200px] lg:w-[110px] lg:mt-[30px] w-[120px]' />
                <div className='md:mx-8 lg:flex justify-between gap-4 mx-auto py-6 lg:py-16 lg:ml-[122px] lg:mr-[122px] lg:w-[1270px] lg:h-[272.77px] lg:mt-[50px]'>
                    <div className='bg-white p-4 mx-4 mt-4 lg:h-[272.77px] lg:w-[402.93px]'>
                        <div className='flex justify-center items-center'>
                            <img src={RequestImg} alt="Request Info" className='h-8 w-8 lg:h-[59px] lg:w-[59px]' />
                            <label className='text-[#FF9F1C] text-lg flex justify-center items-center pl-4 lg:text-[26px] pt-2 lg:pt-3'>Request Info</label>
                        </div>
                        <div>
                            <label className='text-[#507169] max-w-md md:max-w-xl block py-4 lg:text-[19px] font-extralight lg:mt-4'>Easily request detailed information about our programs, facilities, and admission requirements to help you make an informed decision.</label>
                        </div>
                    </div>
                    <div className='bg-white p-4 mx-4 mt-4 lg:h-[272.77px] lg:w-[402.93px]'>
                        <div className='flex justify-center items-center lg:mt-1'>
                            <img src={ApplyImg} alt="Request Info" className='h-8 w-8 lg:h-[43px] lg:w-[45px]' />
                            <label className='text-[#FF9F1C] text-lg pl-4  lg:text-[26px] pt-2 lg:pt-3'>Apply</label>
                        </div>
                        <div>
                            <label className='text-[#507169] max-w-md md:max-w-xl block py-4 lg:text-[19px] font-extralight lg:mt-8'>Complete the online application form to initiate your journey towards joining our vibrant school community.</label>
                        </div>
                    </div>
                    <div className='bg-white p-4 mx-4 mt-4 lg:h-[272.77px] lg:w-[402.93px]'>
                        <div className='flex justify-center items-center lg:mt-4'>
                            <img src={SubmitImg} alt="Request Info" className='h-8 w-8 lg:h-[34px] lg:w-[31.76px]' />
                            <label className='text-[#FF9F1C] text-lg pl-4 lg:text-[26px]'>Submit</label>
                        </div>
                        <div>
                            <label className='text-[#507169] max-w-md md:max-w-xl block py-4 lg:text-[19px] font-extralight lg:mt-5'>Review your application and submit it for processing, ensuring all required documents are included for a smooth admission experience.</label>
                        </div>
                    </div>
                </div>
            </div>

            <section className='mx-auto px-4 mt-[20px] py-4 md:mt-[30px] lg:py-16 lg:flex lg:mb-6 lg:min-w-[1195px] lg:min-h-[701px]'>
                {/* Left side */}
                <div className='lg:ml-[131px]'>
                    <h1 className='text-[#1982C4] lg:text-[50px] text-3xl text-center lg:text-start'>OUR CORE VALUES</h1>
                    <label className='block py-6 lg:w-[498px] lg:text-[21.83px] lg:mt-[41px] md:mx-6 lg:mx-0'>
                        Shikshamitra provides a comprehensive school management solution that enhances the educational experience for everyone involved. Our platform simplifies administrative tasks, making school operations more efficient and reducing the workload for educators. It promotes seamless communication among teachers, students, and parents, ensuring all parties stay informed and connected. Additionally, Shikshamitra supports personalized learning journeys by offering tools tailored to individual student needs and tracking their progress effectively.
                    </label>
                    <button className='bg-[#1982C4] text-white font-semibold text-md rounded-br-full rounded-tl-full p-2 w-[150px] flex justify-center items-center mx-auto lg:w-[248px] lg:h-[67px] lg:mx-0 mb-[10px]'>
                            Learn More
                    </button>
                </div>
                {/* Right side */}
                <div className='grid grid-cols-2 gap-8 md:grid-cols-2 lg:translate-x-6 py-4 lg:min-h-[701px] lg:min-w-[595px] lg:ml-[101px] md:mx-6 md:mt-[30px] lg:mx-0 lg:mt-0'>
                    <div className='border rounded-xl shadow-[10px_10px_10px_rgba(0.1,0.1,0.1,0.1)] p-4 flex flex-col items-center lg:w-[280px] lg:h-[331px]'>
                        <img src={School} alt="School" className='h-14 w-14 md:h-20 md:w-20 lg:h-[112px] lg:w-[110px] lg:mt-[31px]' />
                        <label className='text-center lg:text-[23.96px] lg:mt-[43px]'>
                            Comprehensive School Management
                        </label>
                    </div>
                    <div className='border rounded-xl shadow-[10px_10px_10px_rgba(0.1,0.1,0.1,0.1)] p-4 flex flex-col items-center lg:w-[280px] lg:h-[331px]'>
                        <img src={Communication} alt="Communication" className='h-14 w-14 md:h-20 md:w-20 lg:w-[167px] lg:h-[72px] lg:mt-[74px]' />
                        <label className='text-center lg:text-[23.96px] lg:mt-[43px]'>
                            Seamless Communication
                        </label>
                    </div>
                    <div className='border rounded-md shadow-[10px_10px_10px_rgba(0.1,0.1,0.1,0.1)] p-4 flex flex-col items-center lg:w-[280px] lg:h-[331px]'>
                        <img src={Data} alt="Data" className='h-14 w-14 md:h-20 md:w-20 lg:w-[99px] lg:h-[102px] lg:mt-[45px]' />
                        <label className='text-center lg:text-[23.96px] lg:mt-[43px]'>
                            Data-Driven Insights
                        </label>
                    </div>
                    <div className='border rounded-md shadow-[10px_10px_10px_rgba(0.1,0.1,0.1,0.1)] p-4 flex flex-col items-center lg:w-[280px] lg:h-[331px]'>
                        <img src={Education} alt="Education" className='h-14 w-14 md:h-20 md:w-20 lg:w-[99px] lg:h-[102px] lg:mt-[45px]' />
                        <label className='text-center lg:text-[23.96px] lg:mt-[43px]'>
                            Enhanced Learning Experience
                        </label>
                    </div>
                </div>
            </section>

            <section className='lg:w-[1271px] lg:h-[440px] mx-auto px-4 py-12 mt-[20px] lg:mt-0 border bg-[#FF9F1C] rounded-xl'>
                <div className='flex justify-center items-center'>
                    <div className='text-center md:transform -translate-y-10 p-4 w-full'>
                        <div className='lg:ml-[385px] lg:mr-[359px]'>
                            <h1 className='text-white text-2xl md:text-2xl lg:w-[527px] lg:h-[157px] lg:text-[27.39px] lg:font-semibold py-2'>
                                ARE YOU READY TO GIVE YOUR CHILD THE BEST EDUCATION EXPERIENCE ?
                            </h1>
                            <hr className='bg-white flex justify-center mx-auto md:w-[100px] lg:w-[175px] lg:mt-[-30px] w-[110px] border-2' />
                        </div>
                        <div className='mt-4 lg:w-[937px] lg:h-[108px] lg:ml-[180px] lg:mr-[154px] p-4 lg:p-0'>
                            <label className='gap-6 text-white py-6 text-md lg:text-[18.86px] '>Contact us today to schedule a tour, meet our dedicated staff, and discover our engaging curriculum and nurturing environment. See firsthand why our parents are so happy and let’s work together to create a bright future for your child!</label>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center lg:pb-4'>
                    <button className=" rounded-lg border px-4 py-1 bg-[#FFFFFF] shadow-[10px_10px_10px_rgba(0.1,0.1,0.1,0.1)] lg:w-[238px] lg:h-[55px] text-[#425E57] lg:text-[17px] ">
                        CONTACT US
                    </button>
                </div>
            </section>

            <section className="py-14 mt-[20px] lg:mt-0 mx-4 lg:mx-0">
                <div className="md:flex shadow-[0px_2px_rgba(0,0,0,0.2)] rounded-lg border bg-[#1982C421] lg:w-[1261px] lg:h-[634px] mx-auto ">
                    <div
                        style={{ fontFamily: "Poppins" }}
                        className="flex flex-col  md:p-6 lg:w-[415px] lg:h-[268px] lg:ml-[71px] lg:mt-[110px]"
                    >
                        <h1 className="text-3xl md:text-3xl lg:text-[36.89px] font-medium p-3">
                            OUR LATEST <span className="text-[#1982C4]">BLOGS</span>
                        </h1>
                        <h2 className="text-md text-[#2C2C2C] md:max-w-lg lg:text-[16px] lg:font-light lg:w-[415px] p-3">
                            Welcome to our blog section, where knowledge meets inspiration. Explore insightful articles, expert tips, and the latest trends in our field
                        </h2>
                        <button className="bg-[#194FC4] text-white text-md rounded-br-full rounded-tl-full p-2 w-[110px] ml-4 md:mx-0 lg:mt-[42px] lg:w-[156px] lg:h-[61px]">
                            VIEW All
                        </button>
                        {/* Arrows for scrolling */}
                        <div className="flex ml-4 lg:ml-0 md:mx-0 mt-4 lg:mt-[121px]">
                            <button className="text-[#1982C4] text-3xl">
                                <IoArrowBackCircleOutline />
                            </button>
                            <button className="text-[#1982C4] text-3xl">
                                <IoArrowForwardCircleOutline />
                            </button>
                        </div>
                    </div>
                    {/* Right Side - Grid of Blog Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full overflow-x-hidden justify-center lg:w-[653px] lg:h-[433px] lg:mt-[121px] lg:ml-[42px]">
                        {blogs.map((blog, index) => (
                            <div key={index} className="p-6 w-[300px] flex flex-col justify-between h-full mx-auto md:mx-0">
                                <img src={blog.img} alt={blog.alt} className="w-full h-40 object-cover rounded-md " />
                                <h3 className="text-lg font-semibold mt-4">{blog.heading}</h3>
                                <p className="text-[#000000] mt-2 text-sm flex-grow">{blog.description}</p>
                                <button className="bg-[#194FC4BF] text-white text-md text-center rounded-br-full rounded-tl-full p-1 w-[110px] lg:w-[146px] lg:h-[46px] mt-[20px]">
                                    VIEW All
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto py-14 -translate-y-10 lg:translate-y-0">
                <div>
                    <h1 className="text-xl md:text-3xl text-center" style={{ fontFamily: 'Poppins' }}>
                        <span className="text-[#000000]">OUR HAPPY</span> <span className="text-[#194FC4]">PARENTS</span>
                    </h1>
                    <hr className="border-[#507169] mx-auto w-[100px] mt-4 font-bold border" />
                </div>
                <div className="py-4">
                    <p className="md:text-xl mx-4">
                        "Discover how our dedicated community and nurturing environment have transformed the educational journey for our families. Hear firsthand from parents about the positive impact our school has had on their children's growth and development."
                    </p>
                </div>
                <div className="grid  md:grid-cols-3 lg:grid-cols-3 md:justify-between gap-4 px-4 md:px-0 py-6 md:py-12 mx-auto justify-center items-center md:items-start md:mx-6">
                    {/* First Testimonial */}
                    <div className="relative flex-1 max-w-[280px] py-4 md:py-0">
                        <div className="h-[250px] w-[220px] bg-[#FF3935] absolute transform rotate-12  rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
                        <div className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl  lg:w-[260px] lg:h-[272px]"style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}>
                            <h2 className="text-black text-center py-12 lg:py-16">
                                "We are grateful for the nurturing environment where our daughter has flourished academically and socially!"
                                <h3 className='text-start pl-4 py-4'>--Anitha Verma</h3>

                            </h2>
                            <img src={Testimonial1} alt="Testimonial1" className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]" />
                        </div>
                    </div>

                    {/* Second Testimonial */}
                    <div className="relative flex-1 max-w-[280px] py-4 md:py-0 mt-[30px] md:mt-0">
                        <div className="h-[250px] w-[220px] bg-[#43665E] absolute transform rotate-12 rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
                        <div className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl lg:w-[260px] lg:h-[272px]" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}>
                            <h2 className="text-black text-center py-12 lg:py-16">
                                "We are grateful for the nurturing environment where our daughter has flourished academically and socially!"
                                <h3 className='text-start pl-4 py-4'>--Anitha Verma</h3>
                            </h2>
                            <img src={Testimonial2} alt="Testimonial2" className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]" />
                        </div>
                    </div>

                    {/* Third Testimonial */}
                    <div className="relative flex-1 max-w-[280px] py-4 md:py-0 mt-[30px] md:mt-0">
                        <div className="h-[250px] w-[220px] bg-[#C2089A] absolute transform rotate-12 rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
                        <div className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl lg:w-[260px] lg:h-[272px]" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}>
                            <h2 className="text-black text-center py-12 lg:py-16">
                                "We are grateful for the nurturing environment where our daughter has flourished academically and socially!"
                                <h3 className='text-start pl-4 py-4'>--Anitha Verma</h3>
                            </h2>
                            <img src={Testimonial3} alt="Testimonial3" className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
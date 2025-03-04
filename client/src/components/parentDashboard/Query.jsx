import React from 'react';
import Header from './layout/Header';
import { MessageCircle, User } from 'lucide-react';

function Query() {
  const testimonials = [
    {
      id: 1,
      name: "Erik Runbeck",
      role: "Admin",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      id: 2,
      name: "Erik Runbeck",
      role: "Student",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      id: 3,
      name: "Erik Runbeck",
      role: "Student",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className='min-h-screen'>
      <div className="flex justify-between items-center mx-8 pt-6">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Queries</span>
          </h1>
        </div>
        <div>
          <Header/>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section - Testimonials */}
          <div className="space-y-8">
            <h2 className="text-3xl xl:text-4xl font-bold text-[#146192] mb-8">
              Make Your Doubts Clear !
            </h2>
            
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Query Form */}
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Help us to get know you!
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#146192] focus:border-[#146192]"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="studentName"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#146192] focus:border-[#146192]"
                      placeholder="Enter student name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="queryDetails" className="block text-sm font-medium text-gray-700 mb-1">
                    Query details
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="queryDetails"
                      rows={4}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#146192] focus:border-[#146192]"
                      placeholder="Enter your query details"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#146192] text-white py-2 px-4 rounded-md hover:bg-[#0f4d74] transition-colors duration-200"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Query;
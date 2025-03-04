import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getProfile,
    updateProfile,
    setIsEditing,
} from "../../redux/adminprofile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Building2, Phone, Globe, School, CreditCard, MapPin, X } from "lucide-react";

function AdminProfile() {
    const dispatch = useDispatch();
    const { profile, loading, isEditing } = useSelector(
        (state) => state.adminProfile
    );
    const [formData, setFormData] = useState({});
    const [photoPreview, setPhotoPreview] = useState("");

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile?.Data) {
            setFormData({
                schoolName: profile.Data.schoolName || "",
                schoolCode: profile.Data.schoolCode || "",
                applicationFee: profile.Data.applicationFee || "",
                status: profile.Data.status || "",
                // Address
                street: profile.Data.address?.street || "",
                city: profile.Data.address?.city || "",
                state: profile.Data.address?.state || "",
                country: profile.Data.address?.country || "",
                pincode: profile.Data.address?.pincode || "",
                // Contact
                phone: profile.Data.contact?.phone || "",
                website: profile.Data.contact?.website || "",
                // School Details
                boardType: profile.Data.details?.boardType || "",
                medium: profile.Data.details?.medium || "",
                foundedYear: profile.Data.details?.foundedYear || "",
                // Payment Details
                bankName: profile.Data.paymentDetails?.bankName || "",
                accountNumber: profile.Data.paymentDetails?.accountNumber || "",
                ifscCode: profile.Data.paymentDetails?.ifscCode || "",
                accountHolderName: profile.Data.paymentDetails?.accountHolderName || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                photo: file,
            }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        if (formData.photo) {
            formDataToSend.append("photo", formData.photo);
        }

        await dispatch(updateProfile(formDataToSend));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9F1C]"></div>
            </div>
        );
    }

    const schoolData = profile?.Data;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            <img
                                src={schoolData?.schoolBanner || "https://via.placeholder.com/128"}
                                alt={schoolData?.schoolName}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* School Details */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <School className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">School Details</h2>
                            </div>
                            <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">School Name:</span>
                                    <span className="text-gray-800">{schoolData?.schoolName}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">School Code:</span>
                                    <span className="text-gray-800">{schoolData?.schoolCode}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Board Type:</span>
                                    <span className="text-gray-800">{schoolData?.details?.boardType}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Medium:</span>
                                    <span className="text-gray-800">{schoolData?.details?.medium}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Founded Year:</span>
                                    <span className="text-gray-800">{schoolData?.details?.foundedYear}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    <span className="text-gray-800">{schoolData?.status}</span>
                                </div>
                                
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <Phone className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Phone:</span>
                                    <span className="text-gray-800">{schoolData?.contact?.phone}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Website:</span>
                                    <a 
                                        href={schoolData?.contact?.website}
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {schoolData?.contact?.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <MapPin className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Street:</span>
                                    <span className="text-gray-800">{schoolData?.address?.street}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">City:</span>
                                    <span className="text-gray-800">{schoolData?.address?.city}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">State:</span>
                                    <span className="text-gray-800">{schoolData?.address?.state}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Country:</span>
                                    <span className="text-gray-800">{schoolData?.address?.country}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Pincode:</span>
                                    <span className="text-gray-800">{schoolData?.address?.pincode}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <CreditCard className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Account Holder:</span>
                                    <span className="text-gray-800">{schoolData?.paymentDetails?.accountHolderName}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Account Number:</span>
                                    <span className="text-gray-800">{schoolData?.paymentDetails?.accountNumber}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Bank Name:</span>
                                    <span className="text-gray-800">{schoolData?.paymentDetails?.bankName}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">IFSC Code:</span>
                                    <span className="text-gray-800">{schoolData?.paymentDetails?.ifscCode}</span>
                                </div>
                            </div>
                        </div>

                        {/* Created By Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <Building2 className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">Created By Information</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Email:</span>
                                    <span className="text-gray-800">{schoolData?.createdBy?.email}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Role:</span>
                                    <span className="text-gray-800">{schoolData?.createdBy?.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <Globe className="text-[#FF9F1C]" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">Timestamps</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Created At:</span>
                                    <span className="text-gray-800">
                                        {new Date(schoolData?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="text-gray-600 font-medium">Updated At:</span>
                                    <span className="text-gray-800">
                                        {new Date(schoolData?.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Edit School Profile</h2>
                                <button
                                    onClick={() => dispatch(setIsEditing(false))}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {Object.entries(formData).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <label className="text-lg text-[#000000]">
                                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                            </label>
                                            <input
                                                type={key.includes('year') ? 'number' : 'text'}
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-[#FF9F1C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9F1C]"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => dispatch(setIsEditing(false))}
                                        className="px-6 py-2 border border-[#FF9F1C] text-[#FF9F1C] rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#FF9F1C] text-white rounded-lg hover:bg-[#e59310]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminProfile;
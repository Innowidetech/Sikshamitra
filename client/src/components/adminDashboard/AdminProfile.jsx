import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile, editAdminProfile,fetchTeacherNames,updateAuthorityDetails,updateAuthorityLoginDetails  } from '../../redux/adminProfileSlice';
import { MapPin, Mail, Phone, School, Building2, CreditCard, User2 } from 'lucide-react';
import { FaUserTie, FaEdit,  FaUserGraduate, FaChalkboardTeacher,  FaPlus } from 'react-icons/fa';
import { MdLibraryBooks } from 'react-icons/md';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, updateLoading, updateError, teacherNames } = useSelector(
  (state) => state.adminProfile
);

  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null); 
  const [bannerPreview, setBannerPreview] = useState(null); 
  const [selectedAccountantId, setSelectedAccountantId] = useState(null);
const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);
const [editingField, setEditingField] = useState(null); // 'accountant', 'librarian', 'admissionManager', 'inventoryClerk' or null
const [selectedTeacher, setSelectedTeacher] = useState(''); // store selected teacher id while editing


const [isAuthorityEditing, setIsAuthorityEditing] = useState(false);
const [editingAuthorityField, setEditingAuthorityField] = useState(null);
const [authoritySelections, setAuthoritySelections] = useState({
  accountant: '',
  librarian: '',
  admissionManager: '',
  inventoryClerk: '',
});


// State to hold editable loginId/password for each role
const [authorityLoginsEdit, setAuthorityLoginsEdit] = useState({
  accountant: { loginId: '', password: '' },
  librarian: { loginId: '', password: '' },
  admissionManager: { loginId: '', password: '' },
  inventoryClerk: { loginId: '', password: '' },
});

// Control edit mode for authority login details (separate from main profile edit)
const [isAuthorityLoginEditing, setIsAuthorityLoginEditing] = useState(false);

const [authorityLogins, setAuthorityLogins] = useState({
  accountant: { loginId: '', password: '' },
  librarian: { loginId: '', password: '' },
  admissionManager: { loginId: '', password: '' },
  inventoryClerk: { loginId: '', password: '' },
});

const handleEdit = () => {
  setAuthorityLoginsEdit(authorityLogins);
  setIsEditing(true);
};




useEffect(() => {
  if (profile?.AuthorityLogins) {
    const newLogins = {
      accountant: { loginId: '', password: '' },
      librarian: { loginId: '', password: '' },
      admissionManager: { loginId: '', password: '' },
      inventoryClerk: { loginId: '', password: '' },
    };

    profile.AuthorityLogins.forEach(login => {
      const role = login.employeeType; // e.g. 'accountant'
      if (newLogins[role]) {
        newLogins[role] = {
          loginId: login.email || '',
          password: login.passwordIs || '',
        };
      }
    });

    setAuthorityLoginsEdit(newLogins);
  }
}, [profile]);




  // Refs for file inputs
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

useEffect(() => {
  if (token) {
    dispatch(fetchAdminProfile(token));
    dispatch(fetchTeacherNames(token));  // pass the token here!
  }
}, [dispatch, token]);



    // Initialize formData when profile loads or changes
useEffect(() => {
  if (profile?.Data) {
    setFormData({
      ...profile.Data,
      authority: {
        accountant: profile.AuthorityDetails?.accountant || null,
        librarian: profile.AuthorityDetails?.librarian || null,
        inventoryClerk: profile.AuthorityDetails?.inventoryClerk || null,
        admissionManager: profile.AuthorityLogins?.find(login => login.employeeType === 'admissionsManager') || null
      },
      authorityLogins: profile.AuthorityLogins || []
    });
  }
}, [profile]);



  // if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  // if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  // if (!formData) return null;

  // Handle input change helper
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [field]: value }
    }));
  };

  const handleAuthorityChange = (type, idx, value) => {
    const updatedList = [...formData.authority[type]];
    updatedList[idx].profile.fullname = value;
    setFormData(prev => ({
      ...prev,
      authority: {
        ...prev.authority,
        [type]: updatedList
      }
    }));
  };

  const handleBannerUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, schoolBanner: file }));  // ✅ Store actual File
    setBannerPreview(URL.createObjectURL(file));              // 🖼️ For preview
  }
};

 const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, schoolLogo: file }));   // ✅ Store actual File
    setLogoPreview(URL.createObjectURL(file));               // 🖼️ For preview only
  }
};
  

//  const handleSave = async () => {
//   if (!token) return;

//   try {
//     await dispatch(editAdminProfile({ token, profileData: formData })).unwrap();
//     setIsEditing(false);
//   } catch (err) {
//     console.error('Failed to save profile:', err);
//   }
// };


const handleCancel = () => {
  if (profile?.Data) {
    setFormData({
      ...profile.Data,
      authority: {
        accountant: profile.AuthorityDetails?.accountant || null,
        librarian: profile.AuthorityDetails?.librarian || null,
        inventoryClerk: profile.AuthorityDetails?.inventoryClerk || null,
        admissionManager: profile.AuthorityLogins?.find(login => login.employeeType === 'admissionManager') || null
      }
    });

    // Reset selections and editing state
    setAuthoritySelections({
      accountant: '',
      librarian: '',
      admissionManager: '',
      inventoryClerk: '',
    });
    setEditingField(null);
    setIsEditing(false);
  }
};


  const [selectedTeacherIds, setSelectedTeacherIds] = useState({});

const handleSelectChange = (roleKey, teacherId) => {
  setSelectedTeacherIds(prev => ({ ...prev, [roleKey]: teacherId }));
};


const handleAuthorityChangeById = (type, idx, selectedId) => {
  const selectedTeacher = teacherNames.find(t => t._id === selectedTeacher.profile.fullname);
  if (!selectedTeacher) return;

  const updatedList = [...formData.authority[type]];
  updatedList[idx] = { ...selectedTeacher };

  setFormData(prev => ({
    ...prev,
    authority: {
      ...prev.authority,
      [type]: updatedList
    }
  }));

  // Optionally update state to reflect selected
  if (type === 'accountants') setSelectedAccountantId(selectedId);
  else if (type === 'librarians') setSelectedLibrarianId(selectedId);
};



const handleAuthorityEdit = () => {
  setIsAuthorityEditing(true);

  // Pre-fill current selections
  setAuthoritySelections({
    accountant: formData.authority?.accountant?._id || '',
    librarian: formData.authority?.librarian?._id || '',
    admissionManager: formData.authority?.admissionManager?._id || '',
    inventoryClerk: formData.authority?.inventoryClerk?._id || '',
  });
};

const cancelAuthorityEdit = () => {
  setIsAuthorityEditing(false);
  setAuthoritySelections({
    accountant: '',
    librarian: '',
    admissionManager: '',
    inventoryClerk: '',
  });
};

const handleAuthoritySave = async () => {
  for (const field in authoritySelections) {
    const selectedId = authoritySelections[field];
    if (!selectedId) continue;

    const oldId = formData.authority?.[field]?._id;
    const actionType = oldId ? 'update' : 'add';

    try {
      await dispatch(updateAuthorityDetails({
        token,
        actionType,
        employeeType: field,
        teacherName: selectedTeacher.profile.fullname,
        oldTeacher: oldId,
      })).unwrap();
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  }

  await dispatch(fetchAdminProfile(token));
  setIsAuthorityEditing(false);
};


const handleAuthorityAction = (actionType, roleKey) => {
  const selectedId = selectedTeacherIds[roleKey]; // You should maintain state like { accountant: "id", ... }
  const oldTeacherId = profile?.AuthorityDetails?.[roleKey]?._id;

  dispatch(updateAuthorityDetails({
    token,
    actionType,
    employeeType: roleKey,
    teacherName: selectedTeacher.profile.fullname,
    oldTeacher: oldTeacherId
  }));
};

const handleSave = async () => {
  if (!token) return;

  try {

    setIsEditing(false); // optimistically close edit mode before action
    await dispatch(editAdminProfile({ token, profileData: formData })).unwrap();

    // 1. Save main profile
    await dispatch(editAdminProfile({ token, profileData: formData })).unwrap();

    // 2. Save Authority assignments
    for (const role in authoritySelections) {
      const selectedId = authoritySelections[role];
      if (!selectedId) continue;

      const oldTeacherId = formData.authority?.[role]?._id;
      const actionType = oldTeacherId ? 'update' : 'add';

      const selectedTeacher = teacherNames.find(t => t._id === selectedId);
      const teacherName = selectedTeacher?.profile?.fullname || '';

      await dispatch(updateAuthorityDetails({
        token,
        actionType,
        employeeType: role === 'admissionManager' ? 'admissionsManager' : role,
        teacherName,
        oldTeacher: oldTeacherId,
      })).unwrap();
    }

    // 3. Save Authority login info
    for (const role in authorityLoginsEdit) {
      const { loginId, password } = authorityLoginsEdit[role];
      if (loginId && password) {
        await dispatch(updateAuthorityLoginDetails({
          token,
          email: loginId,
          passwordIs: password,
          employeeType: role === 'admissionManager' ? 'admissionsManager' : role,
        })).unwrap();
      }
    }

    // 4. Fetch updated profile and set it to local form state
   const res = await dispatch(fetchAdminProfile(token)).unwrap();
    console.log("Refetched profile after save:", res);
  } catch (err) {
    console.error('Save failed:', err);
    setIsEditing(true); // re-open edit mode on error
  }
};


useEffect(() => {
  if (profile?.AuthorityDetails) {
    setAuthoritySelections({
      accountant: profile.AuthorityDetails.accountant?._id || '',
      librarian: profile.AuthorityDetails.librarian?._id || '',
      admissionManager: profile.AuthorityDetails.admissionManager?._id || '',
      inventoryClerk: profile.AuthorityDetails.inventoryClerk?._id || '',
    });
  }
}, [profile]);


// Use either the editable formData or the latest profile data
 const displayData = isEditing
    ? formData
    : {
        ...profile?.Data,
        authority: {
          accountant: profile?.AuthorityDetails?.accountant || null,
          librarian: profile?.AuthorityDetails?.librarian || null,
          inventoryClerk: profile?.AuthorityDetails?.inventoryClerk || null,
          admissionManager: profile?.AuthorityLogins?.find(login => login.employeeType === 'admissionsManager') || null,
        },
        authorityLogins: profile?.AuthorityLogins || [],
      };




  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!formData) return null;


  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative w-full mt-20 h-32 sm:h-40 md:h-44 bg-cover bg-center rounded-b-xl overflow-hidden">
        <img
          src={bannerPreview || formData.schoolBanner || 'fallback-url'}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <>
            <button
              onClick={() => bannerInputRef.current.click()}
              className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-sm flex items-center gap-1 hover:bg-white"
              title="Change Banner"
            >
              <FaEdit /> Change Banner
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={bannerInputRef}
              onChange={handleBannerUpload}
            />
          </>
        )}
       <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center px-4 sm:px-10 pb-3 text-white text-center">
  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
    <div className="flex items-center gap-1 sm:gap-2">
      <MapPin size={16} /> {displayData.address}
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <Mail size={16} /> {displayData?.userId?.email}
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <Phone size={16} /> {displayData.contact?.phone}
    </div>
  </div>
</div>

      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6 mt-6 space-y-10">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Left Profile */}
          <div className="lg:w-1/2 w-full space-y-4 text-center flex flex-col items-center relative">
            <img
           src={logoPreview || displayData.schoolLogo || 'fallback-url'}
              alt="Profile"
              className="w-32 h-32 rounded-full border border-gray-300"
            />
            {isEditing && (
              <>
                <button
                  onClick={() => logoInputRef.current.click()}
                  className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-sm flex items-center gap-1 hover:bg-white"
                  title="Change Logo"
                >
                  <FaEdit /> Change Logo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                />
              </>
            )}

            <div className="space-y-1 mt-4 w-full max-w-xs">
              {isEditing ? (
                <input
                  className="text-xl font-semibold border px-2 py-1 rounded w-full"
                  value={formData.principalName || ''}
                  onChange={e => handleChange('principalName', e.target.value)}
                />
              ) : (
                <h2 className="text-xl font-semibold">{formData.principalName || 'Admin'}</h2>
              )}
              <p className="text-gray-600">Admin</p>
            </div>

            <div className="space-y-2 text-gray-700 text-sm text-center mt-4 w-full max-w-xs">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <School size={16} />
                    <input
                      type="text"
                      value={displayData.schoolName || ''}
                      onChange={e => handleChange('schoolName', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="School Name"
                    />
                  </div>
                  <div>
                    <span className="font-medium">Code:</span>{' '}
                    <input
                      type="text"
                      value={formData.schoolCode || ''}
                      onChange={e => handleChange('schoolCode', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="School Code"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <input
                      type="text"
                      value={displayData.contact?.phone || ''}
                      onChange={e => handleContactChange('phone', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <input
                      type="text"
                      value={displayData.address || ''}
                      onChange={e => handleChange('address', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Address"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.contact?.website || ''}
                      onChange={e => handleContactChange('website', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-blue-600"
                      placeholder="Website"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <School size={16} className="inline-block mr-2" />
                    {displayData.schoolName}
                  </p>
                  <p>
                    <span className="font-medium">Code:</span> {formData.schoolCode}
                  </p>
                  <p>
                    <Phone size={16} className="inline-block mr-2" />
                    {displayData.contact?.phone}
                  </p>
                  <p>
                    <MapPin size={16} className="inline-block mr-2" />
                    {displayData.address}
                  </p>
                  <p>
                    <a href={formData.contact?.website} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
                      {formData.contact?.website}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-1 bg-[#285A87]"></div>

          {/* Right Info */}
          <div className="lg:w-1/2 w-full pt-4 lg:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div>
                <span className="font-semibold">Founded Year:</span>{' '}
                {isEditing ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.details?.foundedYear || ''}
                    onChange={e => handleDetailsChange('foundedYear', e.target.value)}
                  />
                ) : (
                  formData.details?.foundedYear || '2005'
                )}
              </div>
              <div>
                <span className="font-semibold">Board Type:</span>{' '}
                {isEditing ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.details?.boardType || ''}
                    onChange={e => handleDetailsChange('boardType', e.target.value)}
                  />
                ) : (
                  formData.details?.boardType || 'CBSE'
                )}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-green-600 font-medium">{formData.status || 'Active'}</span>
              </div>
              <div>
                <span className="font-semibold">Medium:</span>{' '}
                {isEditing ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.details?.medium || ''}
                    onChange={e => handleDetailsChange('medium', e.target.value)}
                  />
                ) : (
                  formData.details?.medium || 'English'
                )}
              </div>
            </div>

 
<div className="mt-8">
  <div className="text-lg font-semibold mb-4">● Authority Details</div>
  <div className="space-y-4">
    {["accountant", "librarian", "admissionManager", "inventoryClerk"].map((roleKey) => {
  const labelMap = {
    accountant: "Accountant",
    librarian: "Librarian",
    admissionManager: "Admission Manager",
    inventoryClerk: "Inventory Clerk"
  };

  const iconMap = {
    accountant: <FaUserTie className="text-blue-700" />,
    librarian: <MdLibraryBooks className="text-blue-700" />,
    admissionManager: <FaUserGraduate className="text-blue-700" />,
    inventoryClerk: <FaChalkboardTeacher className="text-blue-700" />
  };

  const authorityData = profile?.AuthorityDetails?.[roleKey];

  const selectedId = authoritySelections[roleKey];
  const selectedTeacher = teacherNames.find(t => t._id === selectedId);
  const currentTeacherId = selectedId || authorityData?._id || "";
  const currentTeacherName =
    selectedTeacher?.profile?.fullname ||
    authorityData?.profile?.fullname ||
    "N/A";

  return (
    <div key={roleKey} className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-1/3 min-w-[150px]">
        {iconMap[roleKey]}
        <span className="font-semibold text-black">{labelMap[roleKey]}</span>
      </div>

      <div className="w-2/3 flex items-center">
        {isEditing && editingField === roleKey ? (
          <select
            className="w-full bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium"
            value={currentTeacherId}
            onChange={(e) =>
              setAuthoritySelections((prev) => ({
                ...prev,
                [roleKey]: e.target.value,
              }))
            }
            onBlur={() => setEditingField(null)}
          >
            <option value="">Select a teacher</option>
            {teacherNames.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.profile?.fullname}
              </option>
            ))}
          </select>
        ) : (
          <>
            <div className="bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium w-full">
              {currentTeacherName}
            </div>

            {isEditing && (
              <button
                onClick={() => setEditingField(roleKey)}
                className="ml-2 text-blue-600"
                title={currentTeacherName !== "N/A" ? "Edit" : "Add"}
              >
                {currentTeacherName !== "N/A" ? <FaEdit /> : <FaPlus />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
})}




<div className="mt-8">
  <div className="text-lg font-semibold mb-4">● Authority Access</div>

  <div className="grid grid-cols-3 gap-4 mb-4 pl-12">
    <div></div>
    <div className="font-semibold text-[#285A87]">Login ID</div>
    <div className="font-semibold text-[#285A87]">Password</div>
  </div>

  {[
    { key: 'accountant', label: 'Accountant', icon: <FaUserTie className="text-blue-700" /> },
    { key: 'librarian', label: 'Librarian', icon: <MdLibraryBooks className="text-blue-700" /> },
    { key: 'admissionManager', label: 'Admission Manager', icon: <FaUserGraduate className="text-blue-700" /> },
    { key: 'inventoryClerk', label: 'Inventory Clerk', icon: <FaChalkboardTeacher className="text-blue-700" /> },
  ].map(({ key, label, icon }) => (
    <div key={key} className="grid grid-cols-3 gap-4 items-center mb-4">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-semibold text-black">{label}</span>
      </div>

      <div>
        {isEditing ? (
          <input
            type="text"
            value={authorityLoginsEdit[key].loginId}
            onChange={(e) =>
              setAuthorityLoginsEdit(prev => ({
                ...prev,
                [key]: { ...prev[key], loginId: e.target.value }
              }))
            }
            className="w-full bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium"
            placeholder="Enter Login ID"
          />
        ) : (
          <div className="bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium">
            {authorityLoginsEdit[key].loginId || 'N/A'}
          </div>
        )}
      </div>

      <div>
        {isEditing ? (
          <input
            type="password"
            value={authorityLoginsEdit[key].password}
            onChange={(e) =>
              setAuthorityLoginsEdit(prev => ({
                ...prev,
                [key]: { ...prev[key], password: e.target.value }
              }))
            }
            className="w-full bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium"
            placeholder="Enter Password"
          />
        ) : (
          <div className="bg-[#F8FAFC] px-4 py-2 rounded text-gray-800 font-medium">
            {'•'.repeat(authorityLoginsEdit[key].password.length) || 'N/A'}
          </div>
        )}
      </div>
    </div>
  ))}
</div>




  </div>
</div>
</div>
</div>

        {/* Payment Details */}
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-3 text-[#000000]">● Payment Details Of School</h3>
          <div className="bg-[#146192F0] rounded-tr-3xl rounded-br-3xl p-4 text-sm md:text-base md:p-6">
            <div className="grid grid-cols-2 gap-y-3 text-white">
              <div className="font-medium flex items-center gap-2">
                <Building2 size={16} /> Bank Name:
              </div>
              <div>
                {isEditing ? (
                  <input
                    className="text-black w-full px-2 py-1 rounded"
                    value={formData.paymentDetails?.bankName || ''}
                    onChange={e => handlePaymentChange('bankName', e.target.value)}
                  />
                ) : (
                  formData.paymentDetails?.bankName
                )}
              </div>

              <div className="font-medium flex items-center gap-2">
                <CreditCard size={16} /> Account Number:
              </div>
              <div>
                {isEditing ? (
                  <input
                    className="text-black w-full px-2 py-1 rounded"
                    value={formData.paymentDetails?.accountNumber || ''}
                    onChange={e => handlePaymentChange('accountNumber', e.target.value)}
                  />
                ) : (
                  formData.paymentDetails?.accountNumber
                )}
              </div>

              <div className="font-medium flex items-center gap-2">
                <User2 size={16} /> IFSC Code:
              </div>
              <div>
                {isEditing ? (
                  <input
                    className="text-black w-full px-2 py-1 rounded"
                    value={formData.paymentDetails?.ifscCode || ''}
                    onChange={e => handlePaymentChange('ifscCode', e.target.value)}
                  />
                ) : (
                  formData.paymentDetails?.ifscCode
                )}
              </div>

              <div className="font-medium flex items-center gap-2">
                <User2 size={16} /> Account Holder Name:
              </div>
              <div>
                {isEditing ? (
                  <input
                    className="text-black w-full px-2 py-1 rounded"
                    value={formData.paymentDetails?.accountHolderName || ''}
                    onChange={e => handlePaymentChange('accountHolderName', e.target.value)}
                  />
                ) : (
                  formData.paymentDetails?.accountHolderName
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Show error during update */}
{/* Show error during update */}
{updateError && <div className="text-red-600 text-center my-2">{updateError}</div>}

{/* Buttons */}
<div className="mt-6 flex justify-end">
  {isEditing ? (
    <>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded mr-2"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="px-4 py-2 bg-gray-400 text-white rounded"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </>
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default AdminProfile;

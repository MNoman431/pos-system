import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateProfile } from "../../redux/thunks/authThunks/AuthThunk";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Camera } from "lucide-react";
import { Helmet } from "react-helmet-async";

const profileSchema = Yup.object({
  firstName: Yup.string().min(2).max(50).required("First name required"),
  lastName: Yup.string().min(2).max(50).required("Last name required"),
  age: Yup.number().min(0).max(120).nullable(),
  gender: Yup.string().oneOf(["male", "female"]).required("Gender required"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-gray-500">No user found</p>;

  const handleImageChange = (file, setFieldValue) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFieldValue("profileImage", file);
  };

  const submitProfile = async (values, setSubmitting) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    if (values.age) formData.append("age", values.age);
    formData.append("gender", values.gender);
    if (values.profileImage) formData.append("profileImage", values.profileImage);

    try {
      const updatedUser = await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
      setPreview(updatedUser.profileImage || "");
      setEditMode(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl w-full mx-auto mt-14 p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 tracking-tight">
        My Profile
      </h1>

      {/* VIEW MODE */}
      {!editMode && (
        <div className="flex flex-col items-center space-y-5">
          <img
            src={preview || user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-lg"
          />

          <h2 className="text-2xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h2>

          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">Age: {user.age ?? "N/A"}</p>
          <p className="text-gray-600">Gender: {user.gender ?? "N/A"}</p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-6 w-52 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:scale-[1.03]"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <Formik
          enableReinitialize
          initialValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age ?? "",
            gender: user.gender,
            profileImage: null,
          }}
          validationSchema={profileSchema}
          onSubmit={(values, { setSubmitting }) => submitProfile(values, setSubmitting)}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-8 mt-4">
              {/* PROFILE IMAGE */}
              <div className="flex justify-center">
                <div className="relative w-36 h-36">
                  <img
                    src={preview || user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />

                  <label className="absolute bottom-2 right-2 bg-white border border-gray-300 p-2 rounded-full cursor-pointer shadow hover:bg-blue-600 hover:text-white transition">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files[0], setFieldValue)}
                    />
                  </label>
                </div>
              </div>

              {/* NAME FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              {/* AGE + GENDER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Age</label>
                  <Field
                    name="age"
                    type="number"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name="age" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Gender</label>
                  <Field
                    name="gender"
                    as="select"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white shadow transition-all ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Profile;
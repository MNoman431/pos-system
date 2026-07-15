import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import {
  createVendor,
  updateVendor,
  fetchVendorById,
} from "../../redux/thunks/vendorThunks/VendorThunk";
import { Helmet } from "react-helmet-async";

const vendorSchema = Yup.object({
  name: Yup.string().trim().required("Vendor name is required"),
  contactPerson: Yup.string().trim().required("Contact person is required"),
  phone: Yup.string().trim(),
  email: Yup.string().trim().email("Invalid email"),
  address: Yup.string().trim(),
});

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm " +
  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

const errorClass = "text-xs text-red-600 mt-0.5";

const AddVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, currentVendor } = useSelector(
    (state) => state.vendor
  );

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) dispatch(fetchVendorById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-slate-200 p-6">
           <Helmet>
                        <title>New Vendor - FancyStore</title>
                        <meta name="description" content="Create a new vendor for the inventory in FancyStore admin panel" />
                        <link rel="canonical" href={window.location.href} />
                      </Helmet>

        {/* Header */}
        <div className="mb-5 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEdit ? "Edit Vendor" : "Add Vendor"}
          </h2>
          <p className="text-xs text-slate-500">Vendor information</p>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            name: currentVendor?.name || "",
            contactPerson: currentVendor?.contactPerson || "",
            phone: currentVendor?.phone || "",
            email: currentVendor?.email || "",
            address: currentVendor?.address || "",
          }}
          validationSchema={vendorSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = {
                name: values.name.trim(),
                contactPerson: values.contactPerson.trim(),
                phone: values.phone?.trim(),
                email: values.email?.trim(),
                address: values.address?.trim(),
              };

              if (isEdit) {
                await dispatch(updateVendor({ id, data: payload })).unwrap();
                toast.success("Vendor updated successfully");
              } else {
                await dispatch(createVendor(payload)).unwrap();
                toast.success("Vendor added successfully");
              }

              navigate("/vendors");
            } catch (err) {
              toast.error(err || "Something went wrong");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* Vendor Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <Field name="name" className={inputClass} />
                <ErrorMessage name="name" component="p" className={errorClass} />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <Field name="contactPerson" className={inputClass} />
                <ErrorMessage
                  name="contactPerson"
                  component="p"
                  className={errorClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <Field name="phone" className={inputClass} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Field type="email" name="email" className={inputClass} />
                <ErrorMessage name="email" component="p" className={errorClass} />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Address
                </label>
                <Field
                  as="textarea"
                  rows={2}
                  name="address"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full rounded-md py-2.5 text-sm font-semibold transition ${
                  loading || isSubmitting
                    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isEdit ? "Update Vendor" : "Save Vendor"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
AddVendor.whyDidYouRender = true;
AddVendor.pageName = "AddVendor";
export default AddVendor;

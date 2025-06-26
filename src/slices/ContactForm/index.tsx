'use client';

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { useEffect, useState } from "react";
import { isValidEmail } from "@/utils/emailVerifier";
import { FaCheck, FaX } from "react-icons/fa6";

/**
 * Props for `ContactForm`.
 */
export type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

/**
 * Component for "ContactForm" Slices.
 */

const ContactForm = ({ slice }: ContactFormProps): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrors, setShowErrors] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {

    if (name && email && subject && message) setShowErrors(true);
    else setShowErrors(false);

    const newErrors: { [key: string]: string } = {};

    if (name.trim().length <= 2) newErrors.name = "Name: Must be longer than 2 characters.";
    else if (name.trim().length >= 25) newErrors.name = "Name: Must be less than 25 characters.";
    if (subject.trim().length <= 7) newErrors.subject = "Subject: Must be longer than 7 characters.";
    else if (subject.trim().length >= 100) newErrors.subject = "Subject: Must be less than 100 characters.";
    if (!isValidEmail(email)) newErrors.email = "Email: Must be valid.";
    if (message.trim().length <= 50) newErrors.message = "Message: Must be longer than 50 characters";
    else if (message.trim().length >= 1000) newErrors.message = "Message: Must be less than 1000 characters";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [name, email, subject, message]);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");

    const formData = {
      name,
      email,
      subject,
      message
    }
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

      });

      if (!response.ok) {
        setStatusMessage("Send Message Failed");
        console.error("Error submitting form:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);
      setStatusMessage("Message Sent");

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsValid(false);

    } catch (err) {
      setStatusMessage("Send Message Failed");
      console.error("Error submitting form:", err);
    }
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading as="h2" size="lg">
        {slice.primary.form_title}
      </Heading>
      <form onSubmit={submitForm} method="POST" className="mt-16 flex flex-col md:w-1/2 text-black">
        {/* Name and Email in the same div */}
        <div className="flex gap-4 mb-4 w-full">
          <div className="flex-1">
            <Heading as="h3" size="sm" className="mb-2">
              {slice.primary.name_label}<span className="text-red-700 ml-1">*</span>
            </Heading>
            <input
              type="text"
              name={slice.primary.name_label + ""}
              placeholder="Alan Grant"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="flex-1">
            <Heading as="h3" size="sm" className="mb-2">
              {slice.primary.email_label}<span className="text-red-700 ml-1">*</span>
            </Heading>
            <input
              type="email"
              name={slice.primary.email_label + ""}
              placeholder="expert@dinOS.com"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>

        {/* Subject above the message */}
        <div className="mb-4 w-full">
          <Heading as="h3" size="sm" className="mb-2">
            {slice.primary.subject_label}<span className="text-red-700 ml-1">*</span>
          </Heading>
          <input
            type="text"
            name={slice.primary.subject_label + ""}
            placeholder="1993 InGen Incident Details"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
          />
        </div>

        <div className="mb-4 w-full">
          <Heading as="h3" size="sm" className="mb-2">
            {slice.primary.message_label}<span className="text-red-700 ml-1">*</span>
          </Heading>
          <textarea
            name={slice.primary.message_label + ""}
            placeholder={slice.primary.message_label + ""}
            className="w-full p-2 border border-gray-300 rounded-md resize-none"
            rows={4}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            maxLength={1000}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="flex items-center gap-4">
          <button disabled={!isValid} type="submit" className="px-4 py-2 disabled:bg-gray-600 disabled:hover:cursor-not-allowed bg-violet-800 text-white rounded-md hover:bg-violet-500 duration-300 w-full md:w-1/3">
            Submit
          </button>
          <span className="text-sm text-gray-400 flex gap-2 items-center">{statusMessage} {statusMessage === "Message Sent" && <FaCheck className="text-green-800" />} {statusMessage === "Send Message Failed" && <FaX className="text-red-800" />}</span>
        </div>
        {showErrors && Object.keys(errors).length > 0 && (
          <div className="mt-4 text-red-600">
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

      </form>

    </Bounded>
  );
};

export default ContactForm;

import { useState, useEffect, useRef } from "react";
import Section from "./ui/Section";
import InputField from "./ui/InputField";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { SaveButton, CancelButton } from "./ui/Button";
import Spinner from "./ui/Spinner";

const defaultValues = {
  resume: "",
  email: "name@email.com",
  phone: "+63 XXX-XXXXXXX",
  fbtag: "fb/",
  facebook: "fb",
  instagram: "insta",
  intag: "@",
};

export default function Contact() {
  const [contactData, setContactData] = useState(defaultValues);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const emailRef = useRef();
  const phoneRef = useRef();
  const fbRef = useRef();
  const fbtagRef = useRef();
  const inRef = useRef();
  const intagRef = useRef();

  const input1Ref = useRef();
  const input2Ref = useRef();
  const input3Ref = useRef();
  const input4Ref = useRef();
  const input5Ref = useRef();
  const input6Ref = useRef();
  const input7Ref = useRef();

  useEffect(() => {
    const getData = async () => {
      const contact = collection(db, "contact");
      try {
        const data = await getDocs(contact);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setContactData(dataObject[0]);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const reset = () => {
    input1Ref.current.value = "";
    input2Ref.current.value = "";
    input3Ref.current.value = "";
    input4Ref.current.value = "";
    input5Ref.current.value = "";
    input6Ref.current.value = "";
    input7Ref.current.value = "";
    setResume(null);
    setRefetch((prev) => !prev);
  };

  const fileHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setContactData({
        ...contactData,
        resume: URL.createObjectURL(event.target.files[0]),
      });
      setResume(event.target.files[0]);
    }
  };

  const uploadFiles = async (fileObj) => {
    if (!fileObj) return;
    try {
      const storagePath = `resume/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileObj);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    if (
      !emailRef.current &&
      !phoneRef.current &&
      !fbRef.current &&
      !inRef.current &&
      !fbtagRef.current &&
      !intagRef.current &&
      !resume
    ) {
      alert("Nothing to update.");
      return;
    }
    setIsLoading(true);
    const path =
      "https://storage.googleapis.com/database-luy.appspot.com/resume/";
    const data = {
      email: emailRef.current ? emailRef.current : contactData.email,
      phone: phoneRef.current ? phoneRef.current : contactData.phone,
      facebook: fbRef.current ? fbRef.current : contactData.facebook,
      instagram: inRef.current ? inRef.current : contactData.instagram,
      fbtag: fbtagRef.current ? fbtagRef.current : contactData.fbtag,
      intag: intagRef.current ? intagRef.current : contactData.intag,
      resume: resume ? `${path}${resume?.name}` : contactData.resume,
    };
    try {
      await uploadFiles(resume);
      const docRef = doc(db, "contact", contactData.id);
      await updateDoc(docRef, { ...data });
      reset();
      alert("Contact section has been updated.");
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="contact" name="Contact Section">
      <div className="space-y-6">
        <div className="space-y-6 lg:w-[400px]">
          <InputField name="Email">
            <input
              ref={input1Ref}
              id="email"
              type="text"
              placeholder={contactData.email}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                emailRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Phone number">
            <input
              ref={input2Ref}
              id="phone"
              type="text"
              placeholder={contactData.phone}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                phoneRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Facebook profile url">
            <input
              ref={input3Ref}
              id="fb-url"
              type="text"
              placeholder={contactData.facebook}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                fbRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Facebook tag">
            <input
              ref={input4Ref}
              id="fb-tag"
              type="text"
              placeholder={contactData.fbtag}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                fbtagRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Instagram profile url">
            <input
              ref={input5Ref}
              id="in-url"
              type="text"
              placeholder={contactData.instagram}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                inRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Instagram tag">
            <input
              ref={input6Ref}
              id="in-tag"
              type="text"
              placeholder={contactData.intag}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                intagRef.current = e.target.value;
              }}
            />
          </InputField>
          <InputField name="Resume">
            <input
              type="text"
              placeholder={contactData.resume}
              className="input"
              value={contactData.resume}
              readOnly
              disabled={isLoading}
            />
            <label
              htmlFor="resume"
              className="flex w-full items-center justify-center gap-2 rounded px-4 py-1 text-green-600 ring-1 ring-green-600"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Upload Resume"}
            </label>
            <input
              ref={input7Ref}
              id="resume"
              type="file"
              accept="application/pdf"
              hidden
              disabled={isLoading}
              onChange={(e) => {
                fileHandler(e);
              }}
            />
          </InputField>
        </div>
        <div className="flex flex-col gap-4 py-8 lg:flex-row">
          <CancelButton disabled={isLoading} onClick={reset} />
          <SaveButton disabled={isLoading} onClick={handleSubmit} />
        </div>
      </div>
    </Section>
  );
}

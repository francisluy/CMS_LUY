import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  SaveButton,
  CancelButton,
  DeleteButton,
  EditButton,
  AddButton,
} from "./ui/Button";
import Section from "./ui/Section";
import InputField from "./ui/InputField";
import UploadField from "./ui/UploadField";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { imgPlaceholder } from "../assets";

const defaultValues = [
  {
    company: "Loading...",
    position: "My Position",
    date: "Jan 1, 2024 - May 29, 2024",
    image: imgPlaceholder,
    id: "0",
  },
];

export default function Experience() {
  const [expData, setExpData] = useState(defaultValues);
  const [workExp, setWorkExp] = useState(defaultValues[0]);
  const [newImage, setNewImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const companyRef = useRef();
  const positionRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const experience = collection(db, "experience");
      try {
        const data = await getDocs(experience);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const obj = dataObject.sort((a, b) => b.id - a.id);
        setExpData(obj);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const reset = () => {
    setIsEditing(false);
    setIsAdding(false);
    setWorkExp(defaultValues[0]);
    setNewImage(null);
    companyRef.current = undefined;
    positionRef.current = undefined;
    dateRef.current = undefined;
    setRefetch((prev) => !prev);
  };

  const imageHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setWorkExp({
        ...workExp,
        image: URL.createObjectURL(event.target.files[0]),
      });
      setNewImage(event.target.files[0]);
    }
  };

  const uploadFiles = async (fileObj) => {
    if (!fileObj) return;
    try {
      const storagePath = `images/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileObj);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    if (
      isAdding &&
      (!companyRef.current ||
        !positionRef.current ||
        !dateRef.current ||
        !newImage)
    ) {
      alert("Experience data is incomplete.");
      return;
    }

    setIsLoading(true);
    const path =
      "https://storage.googleapis.com/database-luy.appspot.com/images/";
    const imageUrl = `${path}${newImage?.name}`;
    const data = {
      company: isAdding
        ? companyRef.current
        : companyRef.current
          ? companyRef.current
          : workExp.company,
      position: isAdding
        ? positionRef.current
        : positionRef.current
          ? positionRef.current
          : workExp.position,
      date: isAdding
        ? dateRef.current
        : dateRef.current
          ? dateRef.current
          : workExp.date,
      image: isAdding ? imageUrl : newImage ? imageUrl : workExp.image,
    };
    try {
      await uploadFiles(newImage);
      const newId = (parseInt(expData[0].id) + 1).toString();
      const collectionRef = doc(db, "experience", newId);
      const docRef = doc(db, "experience", workExp.id);
      if (isAdding) {
        await setDoc(collectionRef, { ...data });
      } else {
        await updateDoc(docRef, { ...data });
      }
      reset();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setIsAdding(false);
    }
  };

  const deleteExp = async (id, title) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this work experience? \n\n ${title}`,
    );
    if (confirm) {
      try {
        setIsLoading(true);
        const docRef = doc(db, "experience", id);
        await deleteDoc(docRef, id);
        alert(`Work experience ${title} has been deleted.`);
        reset();
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Section id="experiences" name="Experience Section">
      {isEditing || isAdding ? (
        <div className="space-y-6">
          <h3 className="font-semibold">
            {isAdding ? "Add new experience" : "Edit Experience"}
          </h3>
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:justify-end">
            <UploadField
              id="image"
              name="Image"
              src={workExp.image}
              disabled={isLoading}
            >
              <input
                id="image"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                hidden
                disabled={isLoading}
                onChange={(e) => imageHandler(e)}
              />
            </UploadField>
            <div className="space-y-6 lg:w-[400px]">
              <InputField name="Position">
                <input
                  id="position"
                  type="text"
                  placeholder={workExp.position}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    positionRef.current = e.target.value;
                  }}
                />
              </InputField>
              <InputField name="Company">
                <input
                  id="company"
                  type="text"
                  placeholder={workExp.company}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    companyRef.current = e.target.value;
                  }}
                />
              </InputField>
              <InputField name="Date">
                <input
                  id="date"
                  type="text"
                  placeholder={workExp.date}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    dateRef.current = e.target.value;
                  }}
                />
              </InputField>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-8 lg:flex-row">
            <CancelButton disabled={isLoading} onClick={reset} />
            <SaveButton disabled={isLoading} onClick={handleSubmit} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid flex-col gap-10 md:grid-cols-2 md:gap-8 lg:w-[calc(100vw-21rem)] xl:grid-cols-3">
            {expData.map((exp, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center gap-4 rounded-xl  md:justify-between"
              >
                <div className="flex w-full flex-col items-center gap-4">
                  <img
                    src={exp.image}
                    alt="exp picture"
                    className="image-shadow aspect-video w-full rounded-xl object-cover shadow-2xl "
                  />
                  <div className="w-full space-y-4">
                    <div>
                      <p className="text-lg font-semibold">{exp.position}</p>
                      <p>{exp.company}</p>
                      <p className="text-sm">{exp.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4 py-8 lg:flex-row">
                  <EditButton
                    onClick={() => {
                      setIsEditing(true);
                      setWorkExp(expData[index]);
                    }}
                  />
                  <DeleteButton
                    className="flex w-full items-center justify-center  rounded-md px-4 py-2 ring-1 ring-gray-300 lg:w-24"
                    onClick={() => deleteExp(exp.id, exp.company)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="py-8">
            <AddButton onClick={() => setIsAdding(true)} />
          </div>
        </div>
      )}
    </Section>
  );
}

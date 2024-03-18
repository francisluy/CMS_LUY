import { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import UploadField from "./ui/UploadField";
import { SaveButton, CancelButton } from "./ui/Button";
import Section from "./ui/Section";
import InputField from "./ui/InputField";
import { db, storage } from "../config/firebase";

export default function About() {
  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const contentRef = useRef(null);
  const inputRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const about = collection(db, "about");
      try {
        const data = await getDocs(about);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setId(dataObject[0].id);
        setAvatar(dataObject[0].avatar);
        setContent(dataObject[0].content);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const reset = () => {
    inputRef.current.value = "";
    setRefetch((prev) => !prev);
  };

  const imageHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(URL.createObjectURL(event.target.files[0]));
      setNewAvatar(event.target.files[0]);
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
    if (!contentRef.current && !newAvatar) {
      alert("Nothing to update.");
      return;
    }
    setIsLoading(true);
    const path =
      "https://storage.googleapis.com/database-luy.appspot.com/images/";

    const data = {
      content: contentRef.current ? contentRef.current : content,
      avatar: newAvatar ? `${path}${newAvatar?.name}` : avatar,
    };
    try {
      uploadFiles(newAvatar);
      const docRef = doc(db, "about", id);
      await updateDoc(docRef, { ...data });
      reset();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="about" name="About Section">
      <div className="space-y-6">
        <div className="space-y-6 lg:w-[824px]">
          <InputField name="Content" status={null}>
            <textarea
              ref={inputRef}
              id="content"
              cols="30"
              rows="10"
              placeholder={content}
              className="textarea"
              disabled={isLoading}
              onChange={(e) => {
                contentRef.current = e.target.value;
              }}
            />
          </InputField>
        </div>
        <UploadField
          id="avatar"
          name="Avatar"
          src={avatar}
          disabled={isLoading}
        >
          <input
            id="avatar"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            hidden
            disabled={isLoading}
            onChange={(e) => imageHandler(e)}
          />
        </UploadField>

        <div className="flex flex-col gap-4 py-8 lg:flex-row">
          <CancelButton disabled={isLoading} onClick={reset} />
          <SaveButton disabled={isLoading} onClick={handleSubmit} />
        </div>
      </div>
    </Section>
  );
}

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import UploadField from "./ui/UploadField";
import { SaveButton, CancelButton } from "./ui/Button";
import Section from "./ui/Section";
import InputField from "./ui/InputField";
import { db, storage } from "../config/firebase";

export default function Hero() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [background, setBackground] = useState("");
  const [newBackground, setNewBackground] = useState(null);
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [blur, setBlur] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const input1Ref = useRef();
  const input2Ref = useRef();

  useEffect(() => {
    const getData = async () => {
      const hero = collection(db, "hero");
      try {
        const data = await getDocs(hero);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setId(dataObject[0].id);
        setName(dataObject[0].name);
        setTitle(dataObject[0].title);
        setImage(dataObject[0].image);
        setBackground(dataObject[0].background);
        setBlur(dataObject[0].blur);
        setIsBlur(dataObject[0].blur);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const toggleBlur = () => {
    setIsBlur((prev) => !prev);
  };

  const reset = () => {
    input1Ref.current.value = "";
    input2Ref.current.value = "";
    setRefetch((prev) => !prev);
  };

  const imageHandler = (event, field) => {
    if (event.target.files && event.target.files[0]) {
      if (field === "image") {
        setImage(URL.createObjectURL(event.target.files[0]));
        setNewImage(event.target.files[0]);
        return;
      }
      if (field === "background") {
        setBackground(URL.createObjectURL(event.target.files[0]));
        setNewBackground(event.target.files[0]);
        return;
      }
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
      !nameRef.current &&
      !titleRef.current &&
      !newBackground &&
      !newImage &&
      blur === isBlur
    ) {
      alert("Nothing to update.");
      return;
    }
    setIsLoading(true);
    const path =
      "https://storage.googleapis.com/database-luy.appspot.com/images/";

    const data = {
      name: nameRef.current ? nameRef.current : name,
      title: titleRef.current ? titleRef.current : title,
      blur: blur === isBlur ? blur : isBlur,
      background: newBackground ? `${path}${newBackground?.name}` : background,
      image: newImage ? `${path}${newImage?.name}` : image,
    };
    try {
      uploadFiles(newImage);
      uploadFiles(newBackground);
      const docRef = doc(db, "hero", id);
      await updateDoc(docRef, { ...data });
      reset();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="hero" name="Hero Section">
      <div className="space-y-6">
        <div className="space-y-6 lg:w-[400px]">
          <InputField name="Name" status={null}>
            <input
              ref={input1Ref}
              id="name"
              type="text"
              placeholder={name}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                nameRef.current = e.target.value;
              }}
            />
          </InputField>

          <InputField name="Title" status={null}>
            <input
              ref={input2Ref}
              id="title"
              type="text"
              placeholder={title}
              className="input"
              disabled={isLoading}
              onChange={(e) => {
                titleRef.current = e.target.value;
              }}
            />
          </InputField>
        </div>
        <div className="flex w-full flex-col gap-6 lg:flex-row-reverse lg:items-start lg:justify-end">
          <UploadField
            id="hero-image"
            name="Hero Image"
            src={image}
            disabled={isLoading}
          >
            <input
              id="hero-image"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              disabled={isLoading}
              onChange={(e) => imageHandler(e, "image")}
            />
          </UploadField>

          <UploadField
            id="background"
            name="Background"
            src={background}
            disabled={isLoading}
          >
            <input
              id="background"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              disabled={isLoading}
              onChange={(e) => imageHandler(e, "background")}
            />
          </UploadField>
        </div>
        <div className="flex items-center gap-4 ">
          <input
            type="checkbox"
            id="blur"
            name="background-blur"
            checked={isBlur}
            onChange={toggleBlur}
            className="size-5"
            disabled={isLoading}
          />
          <label htmlFor="blur">Apply background blur?</label>
        </div>
        <div className="flex flex-col gap-4 py-8 lg:flex-row">
          <CancelButton disabled={isLoading} onClick={reset} />
          <SaveButton disabled={isLoading} onClick={handleSubmit} />
        </div>
      </div>
    </Section>
  );
}

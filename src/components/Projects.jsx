import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
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
    title: "My Project",
    role: "My Role",
    date: "Jan 1, 2024",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, numquam.",
    image: imgPlaceholder,
    id: "0",
    stack: [],
  },
];

export default function Projects() {
  const [projectsData, setProjectsData] = useState(defaultValues);
  const [project, setProject] = useState(defaultValues[0]);
  const [iconsData, setIconsData] = useState([{}]);
  const [newImage, setNewImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const titleRef = useRef();
  const roleRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();
  const iconsRef = useRef([]);

  useEffect(() => {
    const getData = async () => {
      const projects = collection(db, "projects");
      const icons = collection(db, "icons");
      try {
        const data = await getDocs(projects);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProjectsData(dataObject);

        const iconsData = await getDocs(icons);
        const iconsObject = iconsData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setIconsData(iconsObject);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const reset = () => {
    setIsEditing(false);
    setIsAdding(false);
    setProject(defaultValues[0]);
    setNewImage(null);
    titleRef.current = undefined;
    roleRef.current = undefined;
    dateRef.current = undefined;
    descriptionRef.current = undefined;
    iconsRef.current = [];
    setRefetch((prev) => !prev);
  };

  const imageHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProject({
        ...project,
        image: URL.createObjectURL(event.target.files[0]),
      });
      setNewImage(event.target.files[0]);
    }
  };

  const uploadFiles = async (fileObj) => {
    if (!fileObj) return;
    try {
      const storagePath = `projects/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileObj);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    if (
      isAdding &&
      (!titleRef.current ||
        !roleRef.current ||
        !descriptionRef.current | !dateRef.current ||
        iconsRef.current.length === 0 ||
        !newImage)
    ) {
      alert("Project data is incomplete.");
      return;
    }

    setIsLoading(true);
    const path =
      "https://storage.googleapis.com/database-luy.appspot.com/projects/";
    const imageUrl = `${path}${newImage?.name}`;
    const data = {
      title: isAdding
        ? titleRef.current
        : titleRef.current
          ? titleRef.current
          : project.title,
      role: isAdding
        ? roleRef.current
        : roleRef.current
          ? roleRef.current
          : project.role,
      date: isAdding
        ? dateRef.current
        : dateRef.current
          ? dateRef.current
          : project.date,
      description: isAdding
        ? descriptionRef.current
        : descriptionRef.current
          ? descriptionRef.current
          : project.description,
      image: isAdding ? imageUrl : newImage ? imageUrl : project.image,
      stack: iconsRef.current,
    };
    try {
      await uploadFiles(newImage);
      const collectionRef = collection(db, "projects");
      const docRef = doc(db, "projects", project.id);
      if (isAdding) {
        await addDoc(collectionRef, { ...data });
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

  const deleteProject = async (id, title) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this project? \n\n ${title}`,
    );
    if (confirm) {
      try {
        setIsLoading(true);
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef, id);
        alert(`Project ${title} has been deleted.`);
        reset();
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Section id="projects" name="Projects Section">
      {isEditing || isAdding ? (
        <div className="space-y-6">
          <h3 className="font-semibold">
            {isAdding ? "Add new project" : "Edit Project"}
          </h3>
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:justify-end">
            <UploadField
              id="image"
              name="Image"
              src={project.image}
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
              <InputField name="Title">
                <input
                  id="title"
                  type="text"
                  placeholder={project.title}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    titleRef.current = e.target.value;
                  }}
                />
              </InputField>
              <InputField name="Role">
                <input
                  id="role"
                  type="text"
                  placeholder={project.role}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    roleRef.current = e.target.value;
                  }}
                />
              </InputField>
              <InputField name="Date">
                <input
                  id="date"
                  type="text"
                  placeholder={project.date}
                  className="input"
                  disabled={isLoading}
                  onChange={(e) => {
                    dateRef.current = e.target.value;
                  }}
                />
              </InputField>
              <InputField name="Description">
                <textarea
                  id="description"
                  cols="30"
                  rows="10"
                  placeholder={project.description}
                  className="textarea"
                  disabled={isLoading}
                  onChange={(e) => {
                    descriptionRef.current = e.target.value;
                  }}
                />
              </InputField>

              <InputField name="Tech stack icon">
                <div className="grid grid-cols-2 gap-2">
                  {iconsData.map((icon) => (
                    <div key={icon.id} className="flex gap-2">
                      <input
                        id={icon.id}
                        type="checkbox"
                        value={icon.url}
                        defaultChecked={
                          isAdding
                            ? false
                            : project.stack.includes(icon.url)
                              ? true
                              : false
                        }
                        onChange={(e) => {
                          const arr = e.target.checked
                            ? [...iconsRef.current, icon.url]
                            : iconsRef.current.includes(icon.url)
                              ? iconsRef.current.toSpliced(
                                  iconsRef.current.indexOf(icon.url),
                                  1,
                                )
                              : iconsRef.current;
                          iconsRef.current = arr;
                          console.log(arr);
                        }}
                      />
                      <label htmlFor={icon.id} className="text-sm">
                        {icon.id}
                      </label>
                    </div>
                  ))}
                </div>
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
            {projectsData.map((project, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center gap-4 rounded-xl  md:justify-between"
              >
                <div className="flex w-full flex-col items-center gap-4">
                  <img
                    src={project.image}
                    alt="project picture"
                    className="image-shadow w-full rounded-xl object-cover shadow-2xl "
                  />
                  <div className="w-full space-y-4">
                    <div>
                      <p className="text-lg font-semibold">{project.title}</p>
                      <p>{project.role}</p>
                      <p className="text-sm">{project.date}</p>
                    </div>
                    <p className="max-w-prose text-pretty">
                      {project.description}
                    </p>
                    <div className="flex gap-2">
                      {project.stack.map((logo) => (
                        <img
                          key={logo}
                          src={logo}
                          alt=""
                          className="size-[24px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4 py-8 lg:flex-row">
                  <EditButton
                    onClick={() => {
                      setIsEditing(true);
                      setProject(projectsData[index]);
                      iconsRef.current = projectsData[index].stack;
                    }}
                  />
                  <DeleteButton
                    className="flex w-full items-center justify-center  rounded-md px-4 py-2 ring-1 ring-gray-300 lg:w-24"
                    onClick={() => deleteProject(project.id, project.title)}
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

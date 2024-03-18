import { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {
  SaveButton,
  CancelButton,
  DeleteButton,
  EditButton,
} from "./ui/Button";
import Section from "./ui/Section";
import InputField from "./ui/InputField";
import { db } from "../config/firebase";

const defaultValues = [
  {
    title: "Skill group",
    list: ["skill"],
    id: "1",
  },
];
export default function Skills() {
  const [skillsData, setSkillsData] = useState(defaultValues);
  const [skill, setSkill] = useState(defaultValues[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const titleRef = useRef();
  const listRef = useRef([]);
  const addRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const skills = collection(db, "skills");
      try {
        const data = await getDocs(skills);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSkillsData(dataObject);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const reset = () => {
    setIsEditing(false);
    setRefetch((prev) => !prev);
  };

  const editSkill = (index) => {
    setIsEditing(true);
    setSkill(skillsData[index]);
    listRef.current = skillsData[index].list;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      title: titleRef.current ? titleRef.current : skill.title,
      list: addRef.current
        ? [...listRef.current, addRef.current]
        : listRef.current,
    };
    try {
      const docRef = doc(db, "skills", skill.id);
      await updateDoc(docRef, { ...data });
      reset();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const deleteItem = (index) => {
    const newList = skill.list.toSpliced(index, 1);
    setSkill({ ...skill, list: newList });
    listRef.current = newList;
  };

  return (
    <Section id="skills" name="Skills Section">
      {isEditing ? (
        <div className="space-y-6">
          <h3 className="font-semibold">Edit Skill</h3>
          <div className="space-y-6 lg:w-[400px]">
            <InputField name="Title">
              <input
                id="title"
                type="text"
                placeholder={skill.title}
                className="input"
                disabled={isLoading}
                onChange={(e) => {
                  titleRef.current = e.target.value;
                }}
              />
            </InputField>

            <InputField name="List">
              {skill.list.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <input
                    key={item}
                    type="text"
                    placeholder={item}
                    className="input grow"
                    disabled={isLoading}
                    onChange={(e) => {
                      listRef.current[index] = e.target.value;
                    }}
                  />
                  <DeleteButton
                    disabled={isLoading}
                    onClick={() => deleteItem(index)}
                  />
                </div>
              ))}
            </InputField>
            <InputField name="Add">
              <input
                type="text"
                placeholder="New skill"
                className="input"
                disabled={isLoading}
                onChange={(e) => {
                  addRef.current = e.target.value;
                }}
              />
            </InputField>
          </div>
          <div className="flex flex-col gap-4 py-8 lg:flex-row">
            <CancelButton disabled={isLoading} onClick={reset} />
            <SaveButton disabled={isLoading} onClick={handleSubmit} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="md: flex flex-col items-end gap-4 md:flex-row">
            {skillsData.map((skill, index) => (
              <div
                key={skill?.id}
                className="flex w-full flex-col items-center justify-center rounded-xl bg-white py-10"
              >
                <p className="font-semibold">{skill.title}</p>
                <ul className=" list-inside list-disc">
                  {skill.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <EditButton className="mt-4" onClick={() => editSkill(index)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

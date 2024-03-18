import { useCallback, useEffect, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { imgPlaceholder } from "../assets";
import { DeleteButton } from "./ui/Button";
import { ref, uploadBytes } from "firebase/storage";
import Section from "./ui/Section";
import Spinner from "./ui/Spinner";

const defaultImages = [
  imgPlaceholder,
  imgPlaceholder,
  imgPlaceholder,
  imgPlaceholder,
  imgPlaceholder,
  imgPlaceholder,
];

export default function Artworks() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [artworksData, setArtworksData] = useState(defaultImages);
  const [imageList, SetImageList] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const artworks = collection(db, "artworks");
      try {
        const data = await getDocs(artworks);
        const dataObject = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const images = data.docs.map((doc) => doc.data().url);
        setArtworksData(dataObject);
        SetImageList(images);
        console.log(dataObject);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, [refetch]);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const uploadFiles = async (fileObj) => {
    if (!fileObj) return;
    try {
      const storagePath = `artworks/${fileObj.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileObj);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async (event) => {
    if (event.target.files && event.target.files[0]) {
      try {
        setIsLoading(true);
        const fileObj = event.target.files[0];
        await uploadFiles(fileObj);
        const collectionRef = collection(db, "artworks");
        const path =
          "https://storage.googleapis.com/database-luy.appspot.com/artworks/";
        const imageUrl = `${path}${fileObj?.name}`;
        await addDoc(collectionRef, { url: imageUrl });
        setRefetch((prev) => !prev);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteArtwork = async (id) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this artwork?`,
    );
    if (confirm) {
      try {
        setIsLoading(true);
        const docRef = doc(db, "artworks", id);
        await deleteDoc(docRef, id);
        alert(`Artwork has been deleted.`);
        setRefetch((prev) => !prev);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Section id="artworks" name="Artworks Section">
      <div className="space-y-6">
        <div className="flex items-center gap-8 overflow-x-auto py-4 pb-8">
          {artworksData.map((artwork, index) => (
            <div
              key={index}
              className="flex min-w-[200px] flex-col items-center gap-4"
            >
              <img
                key={index}
                src={artwork.url}
                disabled={isLoading}
                onClick={() => openImageViewer(index)}
                width="300"
                height="300"
                alt=""
                className="size-[200px] cursor-pointer rounded-lg object-cover"
              />
              <DeleteButton
                className="flex w-[calc(100%-4px)]  items-center justify-center rounded-md px-4 py-2 ring-1 ring-gray-300"
                disabled={isLoading}
                onClick={() => deleteArtwork(artwork.id)}
              />
            </div>
          ))}

          {isViewerOpen && (
            <ImageViewer
              src={imageList}
              currentIndex={currentImage}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          )}
        </div>
        <div className="py-8">
          <label
            htmlFor="new-artwork"
            className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-green-600 ring-1 ring-green-600 lg:w-24"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "+ New"}
          </label>
          <input
            id="new-artwork"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            hidden
            disabled={isLoading}
            onChange={(e) => handleSubmit(e)}
          />
        </div>
      </div>
    </Section>
  );
}

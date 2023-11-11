"use client";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { storage } from "../firebase";

export default function WorkInfo() {
  const [workName, setWorkName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [workNum, setWorkNum] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertWorkInfo = async () => {
    if (picture) {
      const storageRef = ref(storage, `images/${picture.name}`);
      await uploadBytes(storageRef, picture);
      const pictureUrl = await getDownloadURL(storageRef);
      try {
        await axios.post("/api/workInfo", {
          workName,
          description,
          picture: pictureUrl,
          workNum,
        });
      } catch (e: any) {
        console.error("작업 정보 업로드 오류:", e);
      }
    }
  };

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login-plz");
    },
  });

  return (
    <>
      <div className="flex flex-col min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">作品情報入力</h2>
          <div className="mb-4">
            <label
              htmlFor="workName"
              className="block text-sm font-medium text-gray-600"
            >
              作品名：
            </label>
            <input
              type="text"
              id="workName"
              name="workName"
              className="mt-1 p-2 border rounded-md w-full text-black"
              onChange={(e) => setWorkName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              説明：
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="mt-1 p-2 border rounded-md w-full text-black"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="picture"
              className="block text-sm font-medium text-gray-600"
            >
              画像：
            </label>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              className="mt-1 p-2 border rounded-md w-full text-white"
              onChange={handleFileChange}
            />
          </div>
          {previewImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                レビュー：
              </label>
              <img
                src={previewImage}
                alt="レビュー"
                className="mt-1 p-2 border rounded-md w-full"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="workNum"
              className="block text-sm font-medium text-gray-600"
            >
              作品番号：
            </label>
            <input
              type="text"
              id="workNum"
              name="workNum"
              className="mt-1 p-2 border rounded-md w-full text-black"
              onChange={(e) => setWorkNum(parseInt(e.target.value, 10))}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full disabled:opacity-50"
            onClick={() => insertWorkInfo()}
            disabled={!workName || !description || !picture || !workNum}
          >
            提出
          </button>
        </div>
      </div>
    </>
  );
}

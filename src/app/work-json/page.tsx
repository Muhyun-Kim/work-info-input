"use client";

import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../firebase";

async function getWorks() {
  const db = getFirestore(app);
  const worksCollection = collection(db, "workInfo");
  const workSnapshot = await getDocs(worksCollection);
  const workList = workSnapshot.docs.map((doc) => {
    const data = doc.data() as WorkInfo;
    return data;
  });
  return workList;
}

interface WorkInfo {
  workName: string;
  description: string;
  picture: string;
  workNum: number;
}

export default function WorkJson() {
  const [works, setWorks] = useState<WorkInfo[]>([]);

  const downloadJsonData = () => {
    const json = JSON.stringify(works, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "work-json.txt"; // 파일 이름을 지정합니다.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    getWorks().then(setWorks);
  }, []);
  return (
    <>
      <div className="p-6">
        <button
          onClick={downloadJsonData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download JSON Data
        </button>
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-4">作品情報</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-lg">
                <img
                  src={work.picture}
                  alt={work.workName}
                  className="w-full h-auto rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{work.workName}</h2>
                <p className="mb-2">{work.description}</p>
                <span className="text-gray-600">作品番号: {work.workNum}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

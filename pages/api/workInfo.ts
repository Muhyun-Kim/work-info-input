import admin from "firebase-admin";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
const serviceAccount = require("../../work-info-input-firebase-adminsdk.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const COLLECTION_NAME = "workInfo";
  //　初期化する
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: cert(serviceAccount),
    });
  }
  const db = getFirestore();

  if (req.method === "POST") {
    try {
      const { workName, description, picture, workNum } = req.body;
      const docRef = db.collection(COLLECTION_NAME).doc();
      const insertData = {
        workName,
        description,
        picture,
        workNum,

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await docRef.set(insertData);
      res.status(200).json({ message: "作品情報がセーブされました" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
  res.status(200);
}

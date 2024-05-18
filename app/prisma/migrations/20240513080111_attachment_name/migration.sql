/*
  Warnings:

  - You are about to drop the column `hash` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `mime` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `name` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachmentTypeId", "id") SELECT "attachmentTypeId", "id" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

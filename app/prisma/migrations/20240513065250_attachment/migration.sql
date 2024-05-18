/*
  Warnings:

  - You are about to drop the column `ext` on the `Attachment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shorthand]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mime` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" INTEGER NOT NULL,
    "attachmentId" INTEGER,
    "content" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Post_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("boardId", "content", "createdAt", "id", "parentId") SELECT "boardId", "content", "createdAt", "id", "parentId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachmentTypeId", "hash", "id") SELECT "attachmentTypeId", "hash", "id" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Board_shorthand_key" ON "Board"("shorthand");

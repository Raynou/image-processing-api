/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_key_key" ON "Image"("key");

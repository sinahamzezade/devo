-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InsuranceFormField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "options" TEXT,
    "validation" TEXT,
    "conditions" TEXT,
    "apiEndpoint" TEXT,
    "sectionId" INTEGER,
    "templateId" INTEGER NOT NULL,
    "parentFieldId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InsuranceFormField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "InsuranceFormTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InsuranceFormField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "InsuranceFormSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InsuranceFormField_parentFieldId_fkey" FOREIGN KEY ("parentFieldId") REFERENCES "InsuranceFormField" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InsuranceFormField" ("createdAt", "id", "label", "name", "options", "required", "templateId", "type", "updatedAt") SELECT "createdAt", "id", "label", "name", "options", "required", "templateId", "type", "updatedAt" FROM "InsuranceFormField";
DROP TABLE "InsuranceFormField";
ALTER TABLE "new_InsuranceFormField" RENAME TO "InsuranceFormField";
CREATE TABLE "new_InsuranceSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_InsuranceSubmission" ("createdAt", "data", "id", "templateId", "updatedAt") SELECT "createdAt", "data", "id", "templateId", "updatedAt" FROM "InsuranceSubmission";
DROP TABLE "InsuranceSubmission";
ALTER TABLE "new_InsuranceSubmission" RENAME TO "InsuranceSubmission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

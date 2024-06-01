-- CreateTable
CREATE TABLE "todo" (
    "id_todo" TEXT NOT NULL,
    "id_external" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id_todo")
);

-- CreateTable
CREATE TABLE "log_atividade" (
    "id_log" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "data" JSONB,
    "action" TEXT,
    "timestamp" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "log_atividade_pkey" PRIMARY KEY ("id_log")
);

import { Types } from "mongoose";
import type { Request, Response } from "express";

import { HousekeepingTaskModel } from "../../models/HousekeepingTask";
import { RoomModel } from "../../models/Room";
import { UserModel } from "../../models/User";
import { sendSuccess } from "../../utils/api";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";

export const listTasks = asyncHandler(
  async (request: Request, response: Response) => {
    const filters: Record<string, unknown> = {};

    if (request.user?.role === "cleaning_staff") {
      filters.assignedTo = new Types.ObjectId(request.user.id);
    }

    const tasks = await HousekeepingTaskModel.find(filters)
      .populate("room", "roomNumber floor type status")
      .populate("assignedTo", "name")
      .sort({ scheduledFor: 1, createdAt: -1 });

    sendSuccess(response, tasks, "Housekeeping tasks fetched");
  },
);

export const createTask = asyncHandler(
  async (request: Request, response: Response) => {
    const task = await HousekeepingTaskModel.create({
      room: request.body.roomId,
      assignedTo: request.body.assignedTo,
      assignedBy: request.user?.id,
      priority: request.body.priority,
      notes: request.body.notes,
      scheduledFor: new Date(request.body.scheduledFor),
    });

    sendSuccess(response, task, "Housekeeping task created", 201);
  },
);

export const listAssignableStaff = asyncHandler(
  async (_request: Request, response: Response) => {
    const staff = await UserModel.find({
      role: "cleaning_staff",
      isActive: true,
    })
      .select("name email role")
      .sort({ name: 1 });

    sendSuccess(response, staff, "Assignable housekeeping staff fetched");
  },
);

export const updateTask = asyncHandler(
  async (request: Request, response: Response) => {
    const update: Record<string, unknown> = {};

    if (request.body.roomId) {
      update.room = request.body.roomId;
    }

    if (request.body.assignedTo) {
      update.assignedTo = request.body.assignedTo;
    }

    if (request.body.priority) {
      update.priority = request.body.priority;
    }

    if (request.body.notes !== undefined) {
      update.notes = request.body.notes;
    }

    if (request.body.scheduledFor) {
      update.scheduledFor = new Date(request.body.scheduledFor);
    }

    const task = await HousekeepingTaskModel.findByIdAndUpdate(
      request.params.id,
      update,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    sendSuccess(response, task, "Task updated");
  },
);

export const deleteTask = asyncHandler(
  async (request: Request, response: Response) => {
    const task = await HousekeepingTaskModel.findByIdAndDelete(
      request.params.id,
    );

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    sendSuccess(response, task, "Task deleted");
  },
);

export const updateTaskStatus = asyncHandler(
  async (request: Request, response: Response) => {
    const task = await HousekeepingTaskModel.findById(request.params.id);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    if (
      request.user?.role === "cleaning_staff" &&
      String(task.assignedTo) !== request.user.id
    ) {
      throw new AppError(403, "You can only update your own tasks");
    }

    task.status = request.body.status;
    task.notes = request.body.notes ?? task.notes;

    if (request.body.status === "in_progress" && !task.startedAt) {
      task.startedAt = new Date();
    }

    if (request.body.status === "completed") {
      task.completedAt = new Date();
      await RoomModel.findByIdAndUpdate(task.room, { status: "available" });
    }

    await task.save();
    sendSuccess(response, task, "Task status updated");
  },
);

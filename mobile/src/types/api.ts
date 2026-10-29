import type { ExerciseCategory, TrackingType } from '@/constants/exercise';

export interface User {
  id: string;
  name: string;
  bodyweightKg: number | null;
  currentStreak: number;
  weeklyGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  bodyweightKg?: number;
  weeklyGoal?: number;
}

export type UpdateUserInput = Partial<Pick<User, 'name' | 'bodyweightKg' | 'weeklyGoal'>>;

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  trackingType: TrackingType;
  isCustom: boolean;
  createdAt: string;
}

export interface CreateExerciseInput {
  name: string;
  category: ExerciseCategory;
  trackingType: TrackingType;
}

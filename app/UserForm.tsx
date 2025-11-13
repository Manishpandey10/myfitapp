"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface UserFormProps {
  onSubmit: (data: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    goal: string;
    level: string;
    dietary: string;
    medical?: string;
    stress: string;
  }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    level: "beginner",
    dietary: "",
    medical: "",
    stress: "medium",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      goal: formData.goal,
      level: formData.level,
      dietary: formData.dietary,
      medical: formData.medical,
      stress: formData.stress,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
    >
      <div className="grid gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="10"
          />
        </div>

        {/* Gender (Now using Shadcn Select) */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
            name="gender"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height (cm) */}
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            min="50"
          />
        </div>

        {/* Weight (kg) */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            min="20"
          />
        </div>

        {/* Fitness Goal (Input, as requested in original snippet) */}
        <div className="space-y-2">
          <Label htmlFor="goal">Fitness Goal</Label>
          <Input
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="e.g. Muscle gain, Weight loss"
            required
          />
        </div>

        {/* Fitness Level (Now using Shadcn Select) */}
        <div className="space-y-2">
          <Label htmlFor="level">Fitness Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => handleSelectChange("level", value)}
            name="level"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your current level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Workout 1-3 days a week) </SelectItem>
              <SelectItem value="intermediate">Intermediate (Workout 2-4 days a week) </SelectItem>
              <SelectItem value="advanced">Advanced (Workout 3-5 days a week) </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dietary Preference (Now using Shadcn Select with your specified options) */}
        <div className="space-y-2">
          <Label htmlFor="dietary">Dietary Preference</Label>
          <Select
            value={formData.dietary}
            onValueChange={(value) => handleSelectChange("dietary", value)}
            name="dietary"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dietary preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegeterian">Vegeterian</SelectItem>
              <SelectItem value="nonVegeterian">Non-Vegeterian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Medical History (optional) */}
        <div className="space-y-2">
          <Label htmlFor="medical">Medical History (optional)</Label>
          <Textarea
            id="medical"
            name="medical"
            value={formData.medical}
            onChange={handleChange}
            placeholder="E.g., knee injury, high blood pressure..."
          />
        </div>

        {/* Stress Level (Now using Shadcn Select) */}
        <div className="space-y-2">
          <Label htmlFor="stress">Stress Level</Label>
          <Select
            value={formData.stress}
            onValueChange={(value) => handleSelectChange("stress", value)}
            name="stress"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stress level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Generate Plan
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

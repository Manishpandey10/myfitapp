'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
name: '',
age: '',
gender: 'male',
height: '',
weight: '',
goal: '',
level: 'beginner',
dietary: '',
medical: '',
stress: 'medium',
});

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
const { name, value } = e.target;
setFormData(prev => ({ ...prev, [name]: value }));
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

return ( <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow"> <div className="grid gap-4"> <div> <Label>Name</Label> <Input name="name" value={formData.name} onChange={handleChange} required /> </div> <div> <Label>Age</Label> <Input type="number" name="age" value={formData.age} onChange={handleChange} required /> </div> <div> <Label>Gender</Label> <select name="gender" value={formData.gender} onChange={handleChange} className="input"> <option value="male">Male</option> <option value="female">Female</option> <option value="other">Other</option> </select> </div> <div> <Label>Height (cm)</Label> <Input type="number" name="height" value={formData.height} onChange={handleChange} required /> </div> <div> <Label>Weight (kg)</Label> <Input type="number" name="weight" value={formData.weight} onChange={handleChange} required /> </div> <div> <Label>Fitness Goal</Label> <Input name="goal" value={formData.goal} onChange={handleChange} placeholder="e.g. Muscle gain, Weight loss" required /> </div> <div> <Label>Fitness Level</Label> <select name="level" value={formData.level} onChange={handleChange} className="input"> <option value="beginner">Beginner</option> <option value="intermediate">Intermediate</option> <option value="advanced">Advanced</option> </select> </div> <div> <Label>Dietary Preference</Label> <Input name="dietary" value={formData.dietary} onChange={handleChange} placeholder="e.g. Vegetarian, Vegan, None" /> </div> <div> <Label>Medical History (optional)</Label> <Textarea name="medical" value={formData.medical} onChange={handleChange} /> </div> <div> <Label>Stress Level</Label> <select name="stress" value={formData.stress} onChange={handleChange} className="input"> <option value="low">Low</option> <option value="medium">Medium</option> <option value="high">High</option> </select> </div> <Button type="submit" className="w-full">Generate Plan</Button> </div> </form>
);
};

export default UserForm;

import { Volunteer } from '../models/Volunteer.js';

export async function createVolunteer(data: { name: string, email: string, createdAt: Date, updatedAt: Date}) {
    return await Volunteer.create(data);
}

export async function getVolunteers() {
    return await Volunteer.find();
}

export async function getVolunteerById(id: string) {
    return await Volunteer.findById(id);
}

export async function updateVolunteer(id: string, name: string) {
    const volunteer = await getVolunteerById(id);
    if (volunteer) {
        volunteer.name = name;
        await volunteer.save();
    }
}
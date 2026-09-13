import { Volunteer } from '../models/Volunteer.js';

type CreateVolunteerInput = { name: string; email: string};
export async function createVolunteer(data: CreateVolunteerInput) {
    return await Volunteer.create(data);
}

export async function getVolunteers() {
    return await Volunteer.find();
}

export async function getVolunteerById(id: string) {
    return await Volunteer.findById(id);
}

export async function updateVolunteer(id: string, data: Partial<{ name: string; email: string}>) {
    const volunteer = await getVolunteerById(id);
    if (volunteer) {
        Object.assign(volunteer, data);
        await volunteer.save();
    }
    return volunteer;
}

export async function deleteVolunteer(id: string) {
    const deleted = await Volunteer.findByIdAndDelete(id);
    return deleted;
}
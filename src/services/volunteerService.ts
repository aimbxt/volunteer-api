import { Volunteer } from '../models/Volunteer.ts';

export async function createVolunteer(data: { name: string, email: string, createdAt: Date, updatedAt: Date}) {
    return await Volunteer.create(data);
}

export async function getVolunteer() {
    return await Volunteer.find()
}
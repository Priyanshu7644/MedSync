import hero_img from './hero_img.png'
import doc1 from './doc1.png'
import appointment_img from './appointment_img.png'

export const assets = {
  hero_img,
  doc1,
  appointment_img,
}

export const specialityData = [
    { speciality: 'General physician', image: '🩺' },
    { speciality: 'Gynecologist', image: '⚕️' },
    { speciality: 'Dermatologist', image: '🧴' },
    { speciality: 'Pediatricians', image: '👶' },
    { speciality: 'Neurologist', image: '🧠' },
    { speciality: 'Gastroenterologist', image: '🏥' },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc1,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Emily has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc1,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Sarah has a strong commitment to delivering comprehensive medical care.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc1,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Christopher has a strong commitment to delivering comprehensive medical care.',
        fees: 40,
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc5',
        name: 'Dr. Michael Chen',
        image: doc1,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Michael focuses on comprehensive care for the nervous system.',
        fees: 80,
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc6',
        name: 'Dr. Amanda Smith',
        image: doc1,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Amanda treats issues in the gastrointestinal tract and liver.',
        fees: 70,
        address: { line1: '67th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
]

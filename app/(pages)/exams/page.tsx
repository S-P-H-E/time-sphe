"use client"
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

interface ExamsData {
    id: string;
    Session_1: Session_1Data;
    Session_2: Session_2Data;
    Day: string;
}

interface Session_1Data {
    subject: string;
    paper: string;
    time: string;
}

interface Session_2Data {
    subject: string;
    paper: string;
    time: string;
}

export default function Exams(){
    const [exams, setExams] = useState<ExamsData[]>([]);
    const today = format(new Date(), 'dd-MM-yyyy');

    useEffect(() => {
        const examsRef = collection(db, 'exams');

        const unsubscribe = onSnapshot(examsRef, (snapshot) => {
            const updatedExamsList = snapshot.docs.map((doc) => {
                console.log(doc.data());
                return {
                    id: doc.id,
                    Session_1: doc.data()["Session 1"] || [],
                    Session_2: doc.data()["Session 2"] || [],
                    Day: doc.data().Day,
                };
            });
        setExams(updatedExamsList);
        });

        return () => unsubscribe();
    }, []);

    const formatDayOfWeek = (dateString: string) => {
        try {
            const parsedDate = parseISO(dateString);
            return format(parsedDate, 'EEEE');
        } catch (error) {
            console.error("Error parsing date: ", error);
            return "";
        }
    };

    return(
        <div>
            <Table className='h-fit rounded-2xl w-[500px] mx-auto'>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Session 1</TableHead>
                    <TableHead>Session 2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exams.map((exam) => (
                    
                    <TableRow key={exam.id}>
                        <TableCell>
                                <h1 className={clsx('border border-[#262626] w-fit px-2 py-1 rounded-md bg-[#050505] mx-auto', exam.id !== today || ' border-red-500 text-red-500 bg-[#120000]')}>
                                    {formatDayOfWeek(exam.Day)}
                                    {exam.id}
                                </h1>
                            {/* <p className='text-[#838383] text-xl font-semibold'>{exam.Day}</p> */}
                        </TableCell>
                        <TableCell>
                            <div className='border border-[#262626] w-fit px-2 py-1 rounded-md bg-[#050505] mx-auto'>
                                <h1 className='text-3xl font-semibold'>{exam.Session_1.subject}</h1>
                                <p className='text-[#838383] text-[13px]'>{exam.Session_1.time}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className='border border-[#262626] w-fit px-2 py-1 rounded-md bg-[#050505] mx-auto'>
                                <h1 className='text-3xl font-semibold'>{exam.Session_2.subject}</h1>
                                <p className='text-[#838383] text-[13px]'>{exam.Session_2.time}</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
    )
}
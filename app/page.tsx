"use client"
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface TimetableData {
  id: string;
  Lessons: string[];
}

export default function Home() {
  const [timetable, setTimetable] = useState<TimetableData[]>([])

  useEffect(() => {
    const timetableRef = collection(db, 'timetable');

    const unsubscribe = onSnapshot(timetableRef, (snapshot) => {
      const updatedTimetableList = snapshot.docs.map((doc) => ({
        id: doc.id,
        Lessons: doc.data().Lessons,
      }));
      setTimetable(updatedTimetableList);
    });

    return () => unsubscribe();
}, []);

  return (
    <>
      <div className='flex flex-col p-10'>
        <Table className='h-fit rounded-2xl w-[1500px] mx-auto'>
          <TableHeader>
            <TableRow>
                <TableHead></TableHead>
                <TableHead>08:05</TableHead>
                <TableHead>09:00</TableHead>
                <TableHead>09:55</TableHead>
                <TableHead>10:25</TableHead>
                <TableHead>11:20</TableHead>
                <TableHead>12:15</TableHead>
                <TableHead>12:40</TableHead>
                <TableHead>13:30</TableHead>
                <TableHead>14:20</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {timetable.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className='text-[#717171] border border-[#262626] w-fit px-2 py-1 rounded-md bg-[#050505]'>
                  {item.id}
                </div>
              </TableCell>
              {item.Lessons.map((lesson, index) => (
                  <TableCell key={index} className='text-white'>
                    <Link href={clsx(lesson === 'Break' || lesson)}>
                      <div className={clsx(lesson !== 'Break' || 'uppercase border border-red-500 text-red-500 bg-[#120000] w-fit px-2 py-1 rounded-md mx-auto', lesson !== 'Reg' || 'text-[#717171] border border-[#262626] w-fit px-2 py-1 rounded-md bg-[#050505] mx-auto uppercase')}>
                        {lesson}
                      </div>
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
    
  )
}

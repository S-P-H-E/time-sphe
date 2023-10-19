"use client"
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io'
import { BsGoogle, BsWikipedia } from 'react-icons/bs'
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { FallingLines } from  'react-loader-spinner'
import openai from '@/app/api/GPT';

interface ScopeData {
    id: string;
    Paper_1: string[];
    Paper_2: string[];
}

type Message = {
    role: "function" | "user" | "system" | "assistant";
    content: string;
};

export default function Scope(){
    const [scope, setScope] = useState<ScopeData | null>(null);
    const router = useRouter()
    const pathname = usePathname()

    const [loading, setLoading] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAspect, setCurrentAspect] = useState('');
    const [gpt3Response, setGpt3Response] = useState('');

    const [response, setResponse] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);

    useEffect(() => {
        const docRef = doc(db, 'scope', pathname);

        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                
                setScope({
                    id: docSnapshot.id,
                    Paper_1: data ? data["Paper 1"] : [],
                    Paper_2: data ? data["Paper 2"] : [],
                });
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching document: ", error);
        });

        return () => unsubscribe();
    }, [pathname]);

    const handleAspectClick = async (aspect: string) => {
        setCurrentAspect(aspect);
        console.log(currentAspect)
        setDialogOpen(true);
        setLoading(true)

        try {
            (true); // Assume you have a loading state to manage UI feedback
    
            // Prepare the message with the aspect included
            const newMessage = {
                role: 'user' as const,
                content: `Please provide information about ${aspect}. in the ${scope?.id} class in grade 11. make it as short as possible, preferably 4 sentences` // Using the aspect here
            };
    
            // Include the new message in the conversation history
            const updatedConversation = [...conversation, newMessage];
    
            // Make the request to GPT-3
            const completion = await openai.chat.completions.create({
                messages: updatedConversation, // This includes all conversation, with the new message
                model: 'gpt-3.5-turbo',
            });
    
            // Extract GPT-3's response
            const modelResponse = completion.choices[0].message.content;
    
            // Update your state with the response
            if (modelResponse) {
                setResponse(modelResponse);
                setConversation(updatedConversation); // Updating the conversation history
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const closeDialog = () => {
        setDialogOpen(false); // Close the dialog
        setResponse(''); // Clear the GPT-3 response
        setCurrentAspect(''); // Clear the current aspect
        setConversation([]); // Clear the conversation history if necessary
    };    

    return(
        <>
            {scope ? (
                <div className='w-[900px] flex flex-col gap-4 rounded-2xl mx-auto'>
                    <div className='bg-white text-black h-[300px] rounded-2xl p-5 font-semibold flex flex-col justify-between items-start'>
                        <button onClick={() => router.back()} className='flex items-center'>
                            <IoIosArrowBack />
                            <p>Go Back</p>
                        </button>
                        <h1 className='text-5xl'>{scope.id}</h1>
                    </div>
                    {scope.Paper_1 ? 
                        <div className='p-4 rounded-2xl bg-[#131313] text-black flex flex-col gap-2 font-semibold'>
                            <h1 className='text-2xl text-[#838383]'>Paper 1</h1>
                            {scope.Paper_1.map((aspect, index) => (
                                <button key={index} className='bg-[#292929] text-white p-3 rounded-lg cursor-pointer text-start' onClick={() => handleAspectClick(aspect)}>
                                    <h1>{aspect}</h1>
                                </button>
                            ))}
                        </div> 
                    : null}

                    {scope.Paper_2 ? 
                        <div className='p-4 rounded-2xl bg-[#131313] text-black flex flex-col gap-2 font-semibold'>
                            <h1 className='text-2xl text-[#838383]'>Paper 2</h1>
                            {scope.Paper_2.map((aspect, index) => (
                                <button key={index} className='bg-[#292929] text-white p-3 rounded-lg cursor-pointer text-start' onClick={() => handleAspectClick(aspect)}>
                                    <h1>{aspect}</h1>
                                </button>
                            ))}
                        </div> 
                    : null}
                </div>
            ) : null}

            {dialogOpen && (
                <Dialog open={dialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentAspect}</DialogTitle>
                            <DialogDescription>
                                {response}
                                {loading && 
                                <div className='w-fit mx-auto'>
                                    <FallingLines
                                    color="#838383"
                                    width="100"
                                    visible={true}
                                />
                                </div>}
                                {/* {response &&  */}
                                <div className='flex w-full ml-auto mt-4 p-2 gap-2 border-y border-[#202020]'>
                                    <a className='transition-all p-2 rounded-md hover:bg-[#202020]' href={`https://www.google.com/search?q=${currentAspect}&sca_esv=574427856&rlz=1C1CHBF_enZA1036ZA1036&sxsrf=AM9HkKkELR8j4lZ1XA5jmQKSk6jijJgkrQ%3A1697631364991&ei=hMwvZd2LPN6A9u8Pi9m6iAg&ved=0ahUKEwjd3eDTyf-BAxVegP0HHYusDoEQ4dUDCBA&uact=5&oq=${currentAspect}&gs_lp=Egxnd3Mtd2l6LXNlcnAiCWJvbWJhY2xhdDIIEAAYgAQYsQMyCxAuGIAEGLEDGIMBMgUQABiABDIFEAAYgAQyBxAAGIAEGAoyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjWKVDLEVi4KHAEeAGQAQCYAf0CoAHHEqoBBTItNi4yuAEDyAEA-AEBqAISwgIHECMYsAMYJ8ICChAAGEcY1gQYsAPCAhAQLhiKBRjIAxiwAxhD2AEBwgIHECMY6gIYJ8ICEBAAGIoFGOoCGLQCGEPYAQLCAhMQLhiKBRjIAxjqAhi0AhhD2AEDwgIWEAAYAxiPARjlAhjqAhi0AhiMA9gBBMICBBAjGCfCAgcQIxiKBRgnwgIIEAAYigUYkQLCAhEQLhiABBixAxiDARjHARjRA8ICCxAuGIoFGLEDGIMBwgILEAAYigUYsQMYgwHCAgsQABiABBixAxiDAcICDRAuGIoFGMcBGNEDGEPCAgcQABiKBRhDwgINEC4YxwEY0QMYigUYQ8ICBxAuGIoFGEPCAgUQLhiABMICHBAuGMcBGNEDGIoFGEMYlwUY3AQY3gQY4ATYAQXCAgoQABiKBRixAxhDwgIKEC4YigUYsQMYQ8ICDRAuGIoFGMcBGK8BGEPCAhMQLhiKBRixAxiDARjHARjRAxhDwgINEAAYigUYsQMYgwEYQ8ICHBAuGIoFGMcBGK8BGEMYlwUY3AQY3gQY4ATYAQXiAwQYACBBiAYBkAYMugYECAEYCLoGBggCEAEYAboGBggDEAEYCLoGBggEEAEYC7oGBggFEAEYFA&sclient=gws-wiz-serp`} target='_blank'>
                                        <BsGoogle size={20}/>
                                    </a>
                                    <a className='transition-all p-2 rounded-md hover:bg-[#202020]' href={`https://en.wikipedia.org/wiki/Special:Search?search=${currentAspect}&go=Go`} target='_blank'>
                                        <BsWikipedia size={20}/>
                                    </a>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <button className='bg-white w-full text-lg py-2 rounded-xl text-black border flex font-semibold justify-center gap-2' onClick={closeDialog}>
                             Close
                        </button>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
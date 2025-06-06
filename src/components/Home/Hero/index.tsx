"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

const Hero = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (search.trim()) {
            router.push(`/courses?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section id="home-section" className='bg-hero-1'>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='lg:col-start-3 lg:col-span-8 col-span-12 flex flex-col gap-8 items-center text-center'>
                        <div className='flex gap-2 mx-auto lg:mx-0'>
                            <Icon
                                icon="solar:verified-check-bold"
                                className="text-success text-xl inline-block me-2"
                            />
                            <p className='text-success text-sm font-semibold text-center lg:text-start'>Enjoy 30% discount on your first course</p>
                        </div>
                        <h1 className='text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0'>
                            Elevate your engineering career with expert guidance.
                        </h1>
                        <h3 className='text-black/70 text-lg pt-5 lg:pt-0'>
                            Master new skills with our curated programs and experienced mentors.
                        </h3>
                        <div className="relative rounded-full pt-5 lg:pt-0 w-full">
                            <input
                                type="text"
                                name="q"
                                className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow"
                                placeholder="Find courses..."
                                autoComplete="off"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="bg-primary p-5 rounded-full absolute right-2 top-2 search-hero"
                                onClick={handleSearch}
                            >
                                <Icon
                                    icon="solar:magnifer-linear"
                                    className="text-white text-4xl inline-block"
                                />
                            </button>
                        </div>
                    </div>    
                </div>
            </div>
        </section>
    );
};

export default Hero;

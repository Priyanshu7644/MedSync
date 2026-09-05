import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, specialityData } from '../assets/assets';

const CITY_COORDINATES = {
    'phagwara': { lat: 31.2240, lng: 75.7708 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'gurugram': { lat: 28.4595, lng: 77.0266 },
    'noida': { lat: 28.5355, lng: 77.3910 },
};

const Header = () => {
    const navigate = useNavigate();
    const [specialityQuery, setSpecialityQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [userCoordinates, setUserCoordinates] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isFetchingLocations, setIsFetchingLocations] = useState(false);

    useEffect(() => {
        if (activeDropdown !== 'location' || !locationQuery || locationQuery.length < 2 || locationQuery === "Current Location") {
            setLocationSuggestions([]);
            return;
        }

        const fetchLocations = async () => {
            setIsFetchingLocations(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&countrycodes=in&limit=5`);
                const data = await response.json();
                setLocationSuggestions(data || []);
            } catch (error) {
                console.error("Error fetching locations", error);
            } finally {
                setIsFetchingLocations(false);
            }
        };

        const debounceFn = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounceFn);
    }, [locationQuery, activeDropdown]);

    const resolveCoordinates = (locText, currentCoords) => {
        if (currentCoords) return currentCoords;
        if (!locText) return null;
        const clean = locText.toLowerCase().trim();
        for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
            if (clean.includes(city)) return coords;
        }
        return null;
    };

    const handleSearch = (loc = locationQuery, spec = specialityQuery, coords = userCoordinates) => {
        const finalCoords = resolveCoordinates(loc, coords);
        navigate('/doctors', { state: { locationQuery: loc, specialityQuery: spec, userCoordinates: finalCoords } });
    }

    const getUserLocation = (e) => {
        if (e) e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserCoordinates(coords);

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
                        const data = await response.json();
                        if (data && data.address) {
                            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || '';
                            const state = data.address.state || '';
                            const displayLocation = [city, state].filter(Boolean).join(', ');
                            setLocationQuery(displayLocation || "Current Location");
                        } else {
                            setLocationQuery("Current Location");
                        }
                    } catch (err) {
                        console.error("Reverse geocoding failed", err);
                        setLocationQuery("Current Location");
                    }

                    setActiveDropdown(null);
                },
                (error) => {
                    console.error("Error getting location", error);
                }
            );
        }
    }

    return (
        <div className='relative w-full bg-[#fef7e5] dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 shadow-md transition-colors duration-300 mb-16 overflow-visible'>

        {/* Top Hero Body: Split Grid with balanced height */}
        <div className='flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-12 py-8 sm:py-11 lg:py-13 gap-8 lg:gap-10'>
            
            {/* Left Content */}
            <div className='lg:w-[53%] flex flex-col items-start gap-4 sm:gap-5 z-10'>
                <div className='inline-flex items-center gap-2 border border-[#00311e]/30 dark:border-[#EAE0C8]/30 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 text-[#00311e] dark:text-[#EAE0C8] px-3.5 py-1 text-xs font-bold tracking-widest uppercase'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#EAE0C8] animate-pulse'></span>
                    #1 Healthcare Platform
                </div>
                
                <h1 className='text-3xl sm:text-4xl lg:text-[2.9rem] font-bold text-[#00311e] dark:text-[#EAE0C8] leading-[1.18] tracking-tight'>
                    Find & Book <br/>
                    <span className='text-[#00311e] dark:text-[#EAE0C8]'>Top-Tier Doctors</span> <br/>
                    In Minutes.
                </h1>
                
                <p className='text-[#00311e]/80 dark:text-[#EAE0C8]/80 text-sm sm:text-base max-w-lg font-light leading-relaxed'>
                    Access a network of verified medical specialists. Check real-time availability, schedule consultations effortlessly, and experience healthcare made simple.
                </p>

                {/* Quick Trust Badges with rating */}
                <div className='flex flex-wrap items-center gap-4 sm:gap-5 pt-1.5 text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80'>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-emerald-600 dark:text-[#EAE0C8] font-bold text-sm'>✓</span>
                        <span>Verified Specialists</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-emerald-600 dark:text-[#EAE0C8] font-bold text-sm'>✓</span>
                        <span>Zero Wait Time</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-emerald-600 dark:text-[#EAE0C8] font-bold text-sm'>✓</span>
                        <span>24/7 Instant Support</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-amber-500 font-bold text-sm'>★</span>
                        <span>4.9/5 Rating</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Professional Realistic Doctor Showcase Card */}
            <div className='lg:w-[47%] w-full flex justify-center lg:justify-end z-10'>
                <div className='relative w-full max-w-[450px] bg-white dark:bg-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 p-3 shadow-xl'>
                    <div className='relative h-[260px] sm:h-[305px] w-full overflow-hidden'>
                        <img 
                            className='w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]' 
                            src={assets.hero_doctor_real || assets.hero_img} 
                            alt="Experienced Medical Specialist" 
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-[#202833]/90 via-transparent to-transparent'></div>
                        <div className='absolute bottom-3.5 left-3.5 right-3.5 text-white flex items-end justify-between'>
                            <div>
                                <p className='font-bold text-sm sm:text-base drop-shadow-md text-white'>Dr. Sarah Jenkins, MD</p>
                                <p className='text-xs text-white/90 drop-shadow-md'>Chief Internal Medicine Specialist</p>
                            </div>
                            <span className='bg-[#202833] dark:bg-[#EAE0C8] text-[#EAE0C8] dark:text-[#202833] text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm'>
                                Top Rated ★
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* Integrated Clean Search Bar (Anchored inside the hero box for full visibility without clipping) */}
            <div className='border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-white/90 dark:bg-[#181E26]/95 p-4 sm:p-5 flex flex-col md:flex-row items-center gap-3 transition-colors'>

                {/* Speciality Input */}
                <div className='relative flex-1 w-full'>
                    <div className='flex items-center bg-[#fef7e5]/50 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-3 focus-within:border-[#00311e] dark:focus-within:border-[#EAE0C8] transition-all'>
                        <span className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 mr-3 text-base'>🩺</span>
                        <input
                            type="text"
                            value={specialityQuery}
                            onChange={(e) => setSpecialityQuery(e.target.value)}
                            onFocus={() => setActiveDropdown('speciality')}
                            onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                            placeholder="Speciality (e.g. General physician, Neurologist)..."
                            className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] placeholder-[#00311e]/50 dark:placeholder-[#EAE0C8]/50 font-medium'
                        />
                    </div>

                    {/* Speciality Dropdown */}
                    <div className={`absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-2xl overflow-hidden z-50 transition-all duration-200 origin-top ${activeDropdown === 'speciality' ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                        <div className='px-4 py-2 bg-[#fef7e5]/50 dark:bg-[#202833]/50 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                            <span className='text-[10px] font-bold text-[#00311e]/70 dark:text-[#EAE0C8]/70 uppercase tracking-wider'>Popular Specialities</span>
                        </div>
                        <ul className='max-h-56 overflow-y-auto'>
                            {specialityData.map((item, index) => (
                                <li
                                    key={index}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSpecialityQuery(item.speciality);
                                        setActiveDropdown(null);
                                        handleSearch(locationQuery, item.speciality, userCoordinates);
                                    }}
                                    className='px-4 py-2.5 hover:bg-[#fef7e5] dark:hover:bg-[#202833] cursor-pointer flex items-center justify-between border-b border-[#00311e]/5 dark:border-[#EAE0C8]/5 last:border-0 transition-colors'
                                >
                                    <div className='flex items-center gap-3'>
                                        <span className='text-base'>{item.image}</span>
                                        <span className='text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] font-medium'>{item.speciality}</span>
                                    </div>
                                    <span className='text-[10px] text-[#00311e]/50 dark:text-[#EAE0C8]/50 font-semibold uppercase'>Select</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='w-px h-8 bg-[#00311e]/20 dark:bg-[#EAE0C8]/20 hidden md:block'></div>

                {/* Location Input */}
                <div className='relative flex-1 w-full'>
                    <div className='flex items-center bg-[#fef7e5]/50 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-3 focus-within:border-[#00311e] dark:focus-within:border-[#EAE0C8] transition-all'>
                        <button onClick={getUserLocation} className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8] mr-3 text-base transition-colors' title="Use Current Location">
                            📍
                        </button>
                        <input
                            type="text"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            onFocus={() => setActiveDropdown('location')}
                            onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="City (e.g. Mumbai, Delhi, Kolkata)..."
                            className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] placeholder-[#00311e]/50 dark:placeholder-[#EAE0C8]/50 font-medium'
                        />
                    </div>

                    {/* Location Dropdown */}
                    <div className={`absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-2xl overflow-hidden z-50 transition-all duration-200 origin-top ${activeDropdown === 'location' ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                        <div
                            onMouseDown={getUserLocation}
                            className='px-4 py-2.5 hover:bg-[#fef7e5] dark:hover:bg-[#202833] cursor-pointer flex items-center gap-2 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 transition-colors'
                        >
                            <span className='text-sm'>📍</span>
                            <span className='text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] font-bold'>Use current GPS location</span>
                        </div>
                        <div className='px-4 py-2 bg-[#fef7e5]/50 dark:bg-[#202833]/50 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                            <span className='text-[10px] font-bold text-[#00311e]/70 dark:text-[#EAE0C8]/70 uppercase tracking-wider'>
                                {locationQuery.length >= 2 && locationQuery !== "Current Location" ? "Suggested Places" : "Popular Localities"}
                            </span>
                        </div>
                        <ul className='max-h-56 overflow-y-auto'>
                            {locationSuggestions.length > 0 ? (
                                locationSuggestions.map((loc, index) => {
                                    const parts = loc.display_name.split(',');
                                    const mainName = parts[0];
                                    const subName = parts.slice(1, 3).join(',');
                                    const coords = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
                                    return (
                                        <li 
                                            key={index} 
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const cleanName = loc.name || mainName;
                                                setLocationQuery(cleanName);
                                                setUserCoordinates(coords);
                                                setActiveDropdown(null);
                                                handleSearch(cleanName, specialityQuery, coords);
                                            }}
                                            className='px-4 py-2.5 hover:bg-[#fef7e5] dark:hover:bg-[#202833] cursor-pointer flex flex-col transition-colors border-b border-[#00311e]/5 dark:border-[#EAE0C8]/5 last:border-0'
                                        >
                                            <span className='font-medium text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8]'>{mainName}</span>
                                            {subName && <span className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-0.5'>{subName.trim()}</span>}
                                        </li>
                                    )
                                })
                            ) : (
                                locationQuery.length >= 2 && locationQuery !== "Current Location" ? (
                                    <li className='px-4 py-3 text-xs text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-center'>
                                        {isFetchingLocations ? "Searching localities..." : "No places found"}
                                    </li>
                                ) : (
                                    [
                                      { name: 'Phagwara, Punjab', coords: { lat: 31.2240, lng: 75.7708 } },
                                      { name: 'Delhi, NCR', coords: { lat: 28.6139, lng: 77.2090 } },
                                      { name: 'Mumbai, Maharashtra', coords: { lat: 19.0760, lng: 72.8777 } },
                                      { name: 'Bangalore, Karnataka', coords: { lat: 12.9716, lng: 77.5946 } },
                                      { name: 'Kolkata, West Bengal', coords: { lat: 22.5726, lng: 88.3639 } },
                                      { name: 'Hyderabad, Telangana', coords: { lat: 17.3850, lng: 78.4867 } }
                                    ].map((loc, index) => (
                                        <li 
                                            key={index} 
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const cleanName = loc.name.split(',')[0];
                                                setLocationQuery(cleanName);
                                                setUserCoordinates(loc.coords);
                                                setActiveDropdown(null);
                                                handleSearch(cleanName, specialityQuery, loc.coords);
                                            }}
                                            className='px-4 py-2.5 hover:bg-[#fef7e5] dark:hover:bg-[#202833] cursor-pointer flex items-center justify-between border-b border-[#00311e]/5 dark:border-[#EAE0C8]/5 last:border-0 transition-colors'
                                        >
                                            <span className='text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8]'>{loc.name}</span>
                                            <span className='text-[#00311e]/40 dark:text-[#EAE0C8]/40 text-[10px] uppercase font-semibold'>Suggestion</span>
                                        </li>
                                    ))
                                )
                            )}
                        </ul>
                    </div>
                </div>

                {/* Search Action Button */}
                <button
                    onClick={() => handleSearch()}
                    className='w-full md:w-auto bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] px-8 py-3 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-sm'
                >
                    Find Care ➔
                </button>
            </div>
        </div>
    )
}

export default Header;

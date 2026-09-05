import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) { 
  return deg * (Math.PI / 180); 
}

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

const getDoctorCoordinates = (doc) => {
  if (doc?.address?.coordinates?.lat && doc?.address?.coordinates?.lng) {
    const lat = parseFloat(doc.address.coordinates.lat);
    const lng = parseFloat(doc.address.coordinates.lng);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  const addrStr = `${doc?.address?.line1 || ''} ${doc?.address?.line2 || ''} ${doc?.address?.locality || ''} ${doc?.address?.pincode || ''}`.toLowerCase();
  
  if (addrStr.includes('phagwara') || addrStr.includes('144401')) return { lat: 31.2240, lng: 75.7708 };
  if (addrStr.includes('jalandhar') || addrStr.includes('144001')) return { lat: 31.3260, lng: 75.5762 };
  if (addrStr.includes('ludhiana') || addrStr.includes('141001')) return { lat: 30.9010, lng: 75.8573 };
  if (addrStr.includes('chandigarh') || addrStr.includes('160017')) return { lat: 30.7333, lng: 76.7794 };
  if (addrStr.includes('amritsar') || addrStr.includes('143001')) return { lat: 31.6340, lng: 74.8723 };
  if (addrStr.includes('delhi') || addrStr.includes('110001')) return { lat: 28.6139, lng: 77.2090 };
  if (addrStr.includes('mumbai') || addrStr.includes('400050') || addrStr.includes('400001')) return { lat: 19.0760, lng: 72.8777 };
  if (addrStr.includes('kolkata') || addrStr.includes('700091') || addrStr.includes('700001')) return { lat: 22.5726, lng: 88.3639 };
  if (addrStr.includes('bangalore') || addrStr.includes('bengaluru') || addrStr.includes('560001')) return { lat: 12.9716, lng: 77.5946 };
  if (addrStr.includes('hyderabad') || addrStr.includes('500001')) return { lat: 17.3850, lng: 78.4867 };
  if (addrStr.includes('pune') || addrStr.includes('411001')) return { lat: 18.5204, lng: 73.8567 };
  if (addrStr.includes('chennai') || addrStr.includes('600001')) return { lat: 13.0827, lng: 80.2707 };
  if (addrStr.includes('london') || addrStr.includes('richmond')) return { lat: 51.5074, lng: -0.1278 };
  if (addrStr.includes('10001') || addrStr.includes('downtown')) return { lat: 40.7128, lng: -74.0060 };
  if (addrStr.includes('20002') || addrStr.includes('uptown')) return { lat: 38.8951, lng: -77.0364 };
  if (addrStr.includes('30003') || addrStr.includes('suburbs')) return { lat: 33.7490, lng: -84.3880 };
  if (addrStr.includes('40004') || addrStr.includes('westside')) return { lat: 34.0522, lng: -118.2437 };
  if (addrStr.includes('50005') || addrStr.includes('eastside')) return { lat: 41.8781, lng: -87.6298 };
  if (addrStr.includes('60006') || addrStr.includes('northside')) return { lat: 29.7604, lng: -95.3698 };
  
  return null;
};

const resolveLocationCoordinates = (locText, currentCoords) => {
  if (currentCoords) return currentCoords;
  if (!locText || locText === 'Current Location') return null;
  const clean = locText.toLowerCase().trim();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(city)) return coords;
  }
  return null;
};

const specialitiesList = [
  { name: 'All Doctors', icon: '🌐' },
  { name: 'General physician', icon: '🩺' },
  { name: 'Gynecologist', icon: '⚕️' },
  { name: 'Dermatologist', icon: '🧴' },
  { name: 'Pediatricians', icon: '👶' },
  { name: 'Neurologist', icon: '🧠' },
  { name: 'Gastroenterologist', icon: '🍽️' },
  { name: 'Other', icon: '➕' }
];

const Doctors = () => {
  const { speciality } = useParams();
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterDoc, setFilterDoc] = useState([]);
  const [searchDoctor, setSearchDoctor] = useState(state?.specialityQuery || '');
  const [searchLocation, setSearchLocation] = useState(state?.locationQuery || '');
  const [userCoordinates, setUserCoordinates] = useState(
    state?.userCoordinates || resolveLocationCoordinates(state?.locationQuery, null)
  );
  const [sortBy, setSortBy] = useState('recommended');

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!showLocationDropdown || !searchLocation || searchLocation.length < 2 || searchLocation === "Current Location") {
      setLocationSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setIsFetchingLocations(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&countrycodes=in&limit=5`);
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
  }, [searchLocation, showLocationDropdown]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setSearchLocation('');
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
              const stateName = data.address.state || '';
              const displayLocation = [city, stateName].filter(Boolean).join(', ');
              setSearchLocation(displayLocation || "Current Location");
            } else {
              setSearchLocation("Current Location");
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
            setSearchLocation("Current Location");
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          setIsLocating(false);
        }
      );
    }
  }

  const clearAllFilters = () => {
    setSearchDoctor('');
    setSearchLocation('');
    setUserCoordinates(null);
    setSortBy('recommended');
    navigate('/doctors');
  }

  const applyFilter = () => {
    const defaultSpecialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'];

    let filtered = [...doctors];

    // Discipline filtering
    if (speciality === 'Other') {
      filtered = filtered.filter(doc => !defaultSpecialities.includes(doc.speciality));
    } else if (speciality && speciality !== 'All Doctors') {
      filtered = filtered.filter(doc => doc.speciality === speciality);
    }

    // Doctor name / query search
    if (searchDoctor.trim()) {
      const lowerQuery = searchDoctor.trim().toLowerCase();
      filtered = filtered.filter(doc => {
        const name = doc.name.toLowerCase();
        const spec = doc.speciality.toLowerCase();
        return name.includes(lowerQuery) || spec.includes(lowerQuery);
      });
    }

    // Active coordinate resolution (either from GPS/suggestions or city lookup)
    const activeCoords = resolveLocationCoordinates(searchLocation, userCoordinates);

    if (activeCoords) {
      filtered = filtered.map(doc => {
        const docCoords = getDoctorCoordinates(doc);
        if (docCoords) {
          const dist = getDistanceFromLatLonInKm(
            activeCoords.lat, activeCoords.lng,
            docCoords.lat, docCoords.lng
          );
          return { ...doc, distance: dist };
        }
        return { ...doc, distance: Infinity };
      });
    } else {
      // Clear distance if no location active
      filtered = filtered.map(doc => {
        const copy = { ...doc };
        delete copy.distance;
        return copy;
      });
    }

    // Sorting options
    if (sortBy === 'recommended') {
      if (activeCoords) {
        // Distance is a critical factor in recommended ranking!
        // Local doctors (< 50 km) are prioritized first.
        // Doctors in same geographic zone are ordered by experience.
        filtered.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          
          // If distances are close (within 15km of each other), rank higher experience first
          if (Math.abs(distA - distB) <= 15) {
            const expA = parseInt(a.experience) || 0;
            const expB = parseInt(b.experience) || 0;
            return expB - expA;
          }
          return distA - distB;
        });
      } else {
        // Default recommended sorting without location: rank by experience
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience) || 0;
          const expB = parseInt(b.experience) || 0;
          return expB - expA;
        });
      }
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else if (sortBy === 'fees-low') {
      filtered.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    } else if (sortBy === 'fees-high') {
      filtered.sort((a, b) => (b.fees || 0) - (a.fees || 0));
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      });
    }

    setFilterDoc(filtered);
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchLocation, searchDoctor, userCoordinates, sortBy]);

  const hasActiveFilters = Boolean(speciality || searchDoctor || (searchLocation && searchLocation !== 'Current Location') || userCoordinates);

  return (
    <div className='py-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors duration-300'>
      
      {/* Directory Header Banner */}
      <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 sm:p-8 lg:p-10 mb-8 shadow-sm'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase mb-2'>
              🩺 Verified Specialist Directory
            </div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
              Find & Consult Doctors
            </h1>
            <p className='text-xs sm:text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/75 mt-1 font-light max-w-xl'>
              Browse through board-certified physicians, check real-time clinic schedules, and reserve your consultation.
            </p>
          </div>

          <div className='flex items-center gap-3 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 px-4 py-2.5 shadow-sm'>
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse'></span>
            <span className='text-xs font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8]'>
              {filterDoc.length} Available Doctors
            </span>
          </div>
        </div>

        {/* Universal Search & Location Bar */}
        <div className='mt-6 pt-6 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 flex flex-col md:flex-row items-center gap-3'>
          
          {/* Doctor / Speciality input */}
          <div className='relative flex-1 w-full'>
            <div className='flex items-center bg-[#fef7e5]/50 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-3 focus-within:border-[#00311e] dark:focus-within:border-[#EAE0C8] transition-all'>
              <span className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 mr-3 text-base'>🔍</span>
              <input 
                type="text"
                placeholder="Search by doctor name, specialty, clinical focus..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] placeholder-[#00311e]/50 dark:placeholder-[#EAE0C8]/50 font-medium'
              />
              {searchDoctor && (
                <button onClick={() => setSearchDoctor('')} className='text-xs font-bold text-[#00311e]/60 dark:text-[#EAE0C8]/60 hover:text-[#00311e] dark:hover:text-[#EAE0C8] ml-2'>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Location input */}
          <div className='relative flex-1 w-full'>
            <div className='flex items-center bg-[#fef7e5]/50 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-3 focus-within:border-[#00311e] dark:focus-within:border-[#EAE0C8] transition-all'>
              <button 
                onClick={getUserLocation}
                className={`mr-3 text-base transition-colors ${isLocating ? 'animate-spin' : 'hover:scale-110'}`}
                title="Use GPS Location"
              >
                📍
              </button>
              <input 
                type="text"
                placeholder={isLocating ? "Detecting GPS location..." : "City, locality or area (e.g. Mumbai, Delhi, Phagwara)..."}
                value={isLocating ? "" : searchLocation}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchLocation(val);
                  if (val === "Current Location") return;
                  const coords = resolveLocationCoordinates(val, null);
                  setUserCoordinates(coords);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowLocationDropdown(false);
                    const coords = resolveLocationCoordinates(searchLocation, userCoordinates);
                    if (coords) setUserCoordinates(coords);
                  }
                }}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowLocationDropdown(false);
                    const coords = resolveLocationCoordinates(searchLocation, userCoordinates);
                    if (coords) setUserCoordinates(coords);
                  }, 250);
                }}
                disabled={isLocating}
                className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] placeholder-[#00311e]/50 dark:placeholder-[#EAE0C8]/50 font-medium disabled:opacity-50'
              />
              {searchLocation && !isLocating && (
                <button onClick={() => { setSearchLocation(''); setUserCoordinates(null); }} className='text-xs font-bold text-[#00311e]/60 dark:text-[#EAE0C8]/60 hover:text-[#00311e] dark:hover:text-[#EAE0C8] ml-2'>
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showLocationDropdown && searchLocation.length >= 2 && searchLocation !== "Current Location" && !isLocating && (
              <div className='absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-2xl z-50 overflow-hidden'>
                <ul className='max-h-56 overflow-y-auto'>
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((loc, index) => {
                      const parts = loc.display_name.split(',');
                      const mainName = parts[0];
                      const coords = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
                      return (
                        <li 
                          key={index}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const cleanName = loc.name || mainName;
                            setSearchLocation(cleanName);
                            setUserCoordinates(coords);
                            setShowLocationDropdown(false);
                          }}
                          className='px-4 py-2.5 hover:bg-[#fef7e5] dark:hover:bg-[#202833] cursor-pointer border-b border-[#00311e]/5 dark:border-[#EAE0C8]/5 last:border-0 transition-colors'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='font-medium text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8]'>{mainName}</span>
                            <span className='text-[10px] uppercase font-bold text-[#00311e]/50 dark:text-[#EAE0C8]/50'>Select</span>
                          </div>
                          <div className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-0.5 truncate'>{parts.slice(1, 3).join(',')}</div>
                        </li>
                      )
                    })
                  ) : (
                    <li className='px-4 py-3 text-xs text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-center'>
                      {isFetchingLocations ? "Searching localities..." : "No places found"}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Sort By selector */}
          <div className='w-full md:w-auto flex items-center bg-[#fef7e5]/50 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-3'>
            <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mr-2 font-semibold uppercase'>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='bg-transparent text-xs sm:text-sm text-[#00311e] dark:text-[#EAE0C8] font-bold outline-none cursor-pointer'
            >
              <option value="recommended" className='bg-white dark:bg-[#202833]'>Recommended (Nearest & Best)</option>
              <option value="experience" className='bg-white dark:bg-[#202833]'>Most Experienced</option>
              <option value="fees-low" className='bg-white dark:bg-[#202833]'>Fee: Low to High</option>
              <option value="fees-high" className='bg-white dark:bg-[#202833]'>Fee: High to Low</option>
              {userCoordinates && <option value="distance" className='bg-white dark:bg-[#202833]'>Strictly Nearest First</option>}
            </select>
          </div>

        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className='flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-xs'>
            <span className='text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60 mr-1'>Active Filters:</span>
            {speciality && (
              <span className='inline-flex items-center gap-1.5 bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] px-2.5 py-1 text-xs font-bold'>
                {speciality}
                <button onClick={() => navigate('/doctors')} className='hover:opacity-75'>✕</button>
              </span>
            )}
            {searchDoctor && (
              <span className='inline-flex items-center gap-1.5 bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] px-2.5 py-1 text-xs font-bold'>
                "{searchDoctor}"
                <button onClick={() => setSearchDoctor('')} className='hover:opacity-75'>✕</button>
              </span>
            )}
            {searchLocation && (
              <span className='inline-flex items-center gap-1.5 bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] px-2.5 py-1 text-xs font-bold'>
                📍 {searchLocation}
                <button onClick={() => { setSearchLocation(''); setUserCoordinates(null); }} className='hover:opacity-75'>✕</button>
              </span>
            )}
            <button 
              onClick={clearAllFilters}
              className='text-xs underline text-[#00311e]/80 dark:text-[#EAE0C8]/80 hover:text-[#00311e] dark:hover:text-[#EAE0C8] font-bold ml-2'
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Doctor Grid */}
      <div className='flex flex-col lg:flex-row items-start gap-8'>
        
        {/* Mobile Filter Toggle */}
        <button
          className={`lg:hidden w-full py-3 px-4 border border-[#00311e] dark:border-[#EAE0C8] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${showFilter ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833]' : 'bg-white dark:bg-[#181E26]'}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          <span>Browse By Discipline</span>
          <span>{showFilter ? '▲ Hide' : '▼ Filter'}</span>
        </button>

        {/* Sidebar Discipline Filter Menu (Sticky & Pinned) */}
        <div className={`w-full lg:w-64 lg:sticky lg:top-6 lg:self-start lg:shrink-0 flex-col gap-3 z-20 ${showFilter ? 'flex' : 'hidden lg:flex'}`}>
          <div className='p-3 bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-sm'>
            <p className='text-[10px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60 pb-2 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 mb-2'>
              Speciality Discipline
            </p>
            <div className='flex flex-col gap-1.5'>
              {specialitiesList.map((item) => {
                const isSelected = item.name === 'All Doctors' ? !speciality : speciality === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.name === 'All Doctors') navigate('/doctors', { replace: true, preventScrollReset: true });
                      else navigate(`/doctors/${item.name}`, { replace: true, preventScrollReset: true });
                      setShowFilter(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between border ${isSelected ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] border-[#00311e] dark:border-[#EAE0C8] shadow-sm' : 'bg-[#fef7e5]/40 dark:bg-[#202833]/50 text-[#00311e] dark:text-[#EAE0C8] border-transparent hover:border-[#00311e]/30 dark:hover:border-[#EAE0C8]/30'}`}
                  >
                    <div className='flex items-center gap-2.5'>
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {isSelected && <span>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className='hidden lg:block bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-4 shadow-sm text-xs'>
            <b className='block text-xs font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8] mb-1'>Need Immediate Help?</b>
            <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-[11px] leading-relaxed mb-3'>
              Speak with our healthcare concierge to match you with the right specialist.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className='w-full py-2 bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] text-[10px] font-bold uppercase tracking-wider transition-all border border-[#00311e]/20 dark:border-[#EAE0C8]/20'
            >
              Contact Support ➔
            </button>
          </div>
        </div>

        {/* Doctor Profiles Grid */}
        <div className='flex-1 w-full'>
          {filterDoc.length === 0 ? (
            <div className='p-12 text-center bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-sm space-y-4'>
              <span className='text-4xl block'>🩺</span>
              <h3 className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>No Doctors Found Matching Your Criteria</h3>
              <p className='text-xs sm:text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 max-w-md mx-auto'>
                Try adjusting your search terms, changing the location filter, or switching to another medical discipline.
              </p>
              <button
                onClick={clearAllFilters}
                className='mt-2 bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm'
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
              {filterDoc.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
                  className='group bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden'
                >
                  <div>
                    {/* Doctor Photo Holder */}
                    <div className='relative h-56 bg-[#fef7e5]/50 dark:bg-[#202833] overflow-hidden border-b border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
                      <img 
                        className='w-full h-full object-cover object-top filter brightness-[0.98] group-hover:scale-105 transition-transform duration-500' 
                        src={item.image} 
                        alt={item.name} 
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-[#202833]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      
                      {/* Top Badges */}
                      <div className='absolute top-3 left-3 right-3 flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 bg-white/95 dark:bg-[#181E26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#00311e]/10 dark:border-[#EAE0C8]/20 shadow-sm'>
                          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                          <span className='text-[#00311e] dark:text-[#EAE0C8]'>Available</span>
                        </div>
                        <span className='bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] text-[10px] font-bold px-2 py-0.5 shadow-sm'>
                          Verified ★
                        </span>
                      </div>

                      {/* Tiered Distance overlay badge */}
                      {item.distance !== undefined && item.distance !== Infinity && (
                        item.distance < 35 ? (
                          <div className='absolute bottom-2 left-2 bg-emerald-900/95 text-emerald-100 text-[10px] font-bold px-2.5 py-1 shadow-md flex items-center gap-1.5 border border-emerald-400/40'>
                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>
                            <span>📍 {item.distance < 1 ? 'Under 1 km' : item.distance.toFixed(1) + ' km'} • In Your City</span>
                          </div>
                        ) : item.distance < 300 ? (
                          <div className='absolute bottom-2 left-2 bg-[#202833]/95 text-amber-200 text-[10px] font-bold px-2.5 py-1 shadow-md border border-amber-400/30 flex items-center gap-1'>
                            <span>🚗 {Math.round(item.distance)} km away (Regional)</span>
                          </div>
                        ) : item.distance < 1500 ? (
                          <div className='absolute bottom-2 left-2 bg-[#202833]/95 text-sky-200 text-[10px] font-bold px-2.5 py-1 shadow-md border border-sky-400/30 flex items-center gap-1'>
                            <span>✈️ {Math.round(item.distance)} km away (Interstate)</span>
                          </div>
                        ) : (
                          <div className='absolute bottom-2 left-2 bg-[#202833]/95 text-gray-300 text-[10px] font-bold px-2.5 py-1 shadow-md border border-white/20 flex items-center gap-1'>
                            <span>🌐 Telehealth / Remote ({Math.round(item.distance).toLocaleString()} km)</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Doctor Details */}
                    <div className='p-5 space-y-2.5'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <h3 className='font-bold text-base text-[#00311e] dark:text-[#EAE0C8] group-hover:text-emerald-800 dark:group-hover:text-white transition-colors'>
                            {item.name}
                          </h3>
                          <p className='text-xs font-semibold text-[#00311e]/75 dark:text-[#EAE0C8]/80'>
                            {item.speciality}
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
                        {item.degree && (
                          <span className='bg-[#00311e]/5 dark:bg-[#202833] px-2 py-0.5 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
                            🎓 {item.degree}
                          </span>
                        )}
                        {item.experience && (
                          <span className='bg-[#00311e]/5 dark:bg-[#202833] px-2 py-0.5 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
                            ⏳ {item.experience}
                          </span>
                        )}
                      </div>

                      {item.address?.line1 && (
                        <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 truncate pt-1'>
                          📍 {item.address.line1}, {item.address.line2 || ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className='p-5 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 flex items-center justify-between bg-[#fef7e5]/20 dark:bg-[#202833]/30'>
                    <div>
                      <span className='text-[10px] uppercase font-semibold text-[#00311e]/50 dark:text-[#EAE0C8]/50 block'>Consultation</span>
                      <span className='text-base font-bold text-[#00311e] dark:text-[#EAE0C8]'>
                        {currencySymbol}{item.fees}
                      </span>
                    </div>
                    <button className='bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm'>
                      Book ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default Doctors;

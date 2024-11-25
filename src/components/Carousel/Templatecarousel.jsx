import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TemplateCarousel = ({ images, setSelectedTemp }) => {
    console.log(images)
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(images.length / itemsPerPage);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalPages);
    };
    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalPages) % totalPages);
    };
    const startIndex = currentSlide * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, images.length);
    return (
        <div className="relative p-5">
         {images?.length>6 &&   <Button className='absolute top-[35%] z-10 left-[-10px] bg-transparent' onClick={prevSlide} auto ghost>
                <ChevronLeft size={24} />
            </Button>}
            <div className="grid grid-cols-6 gap-3 transition-all duration-700 overflow-hidden">
                {images.slice(startIndex, endIndex).map((image, index) => (
                    <div key={index} onClick={() => setSelectedTemp(image)} className='border-2 hover:cursor-pointer'>
                        <img  key={index} src={image?.thumbnail} alt={`Slide ${startIndex + index + 1}`} className="w-full" />
                    </div>

                ))}
            </div>
          {images?.length>6 &&  <Button auto ghost className='absolute top-[35%] z-10 right-[-10px] bg-transparent' onClick={nextSlide}>
                <ChevronRight size={24} />
            </Button>}
        </div>
    );
};

export default TemplateCarousel;
